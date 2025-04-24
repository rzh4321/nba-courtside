from sqlalchemy import (
    create_engine,
    text,
    Column,
    BigInteger,
    String,
    Numeric,
    DateTime,
    Date,
    ForeignKey,
    and_,
    Boolean,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, validates
from sqlalchemy.sql import func
from sqlalchemy.pool import QueuePool
from enum import Enum
from datetime import date, timedelta, datetime
import os
from dotenv import load_dotenv
import requests
import pytz
import logging

logger = logging.getLogger(__name__)

Base = declarative_base()


class Game(Base):
    __tablename__ = "games"

    id = Column(BigInteger, primary_key=True)

    # game information
    game_id = Column(String(255), unique=True, index=True)
    home_team = Column(String(255), nullable=False)
    away_team = Column(String(255), nullable=False)

    # spread
    home_spread_odds = Column(Numeric(6, 2))
    away_spread_odds = Column(Numeric(6, 2))
    home_spread = Column(Numeric(5, 2))
    opening_home_spread = Column(Numeric(5, 2), nullable=False)
    home_moneyline = Column(Numeric(8, 2))
    away_moneyline = Column(Numeric(8, 2))

    # over/under
    opening_over_under = Column(Numeric(5, 2), nullable=False)
    over_under = Column(Numeric(5, 2))
    over_odds = Column(Numeric(6, 2))
    under_odds = Column(Numeric(6, 2))

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    game_date = Column(Date, nullable=False)
    has_ended = Column(Boolean, nullable=False, default=False)

    def __repr__(self):
        return (
            f"<Game("
            f"game_id={self.game_id}, "
            f"home_team={self.home_team}, "
            f"away_team={self.away_team}, "
            f"game_date={self.game_date}"
            f"has_ended={self.has_ended}"
            f")>"
        )


load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")
FAST_API_URL = os.getenv("API_URL", "http://127.0.0.1:8000/api")

DATABASE_URL = f"postgresql+psycopg2://{USER}.{HOST}:{PASSWORD}@aws-0-us-east-2.pooler.supabase.com:{PORT}/{DBNAME}"

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,  # Set maximum number of permanent connections
    max_overflow=10,  # Allow up to 10 connections to overflow temporarily
    pool_timeout=30,  # Wait up to 30 seconds for a connection
    pool_recycle=1800,  # Recycle connections after 30 minutes
)

try:
    with engine.connect() as connection:
        logger.info("Connection successful!")
except Exception as e:
    logger.error(f"Failed to connect: {e}")

Session = sessionmaker(bind=engine)


def notify_odds_update(game):
    game_date_str = game.game_date.strftime("%Y-%m-%d")
    try:
        # gameId is available, not first time scraping this game
        if game.game_id:
            logger.info(f"GAME ID IS AVAILABLE, CALLING API WITH GAMEID {game.game_id}")
            # Use game_id endpoint if available
            response = requests.post(
                f"{FAST_API_URL}/notify-odds-update", json={"gameId": game.game_id}
            )
        # gameId is null, first time scraping this game
        else:
            logger.info(f"GAMEID IS NULL, CALLING API WITH TEAMS AND DATE")
            # Use team-based endpoint if no game_id
            response = requests.post(
                f"{FAST_API_URL}/notify-odds-by-teams",
                json={
                    "homeTeam": game.home_team,
                    "awayTeam": game.away_team,
                    "gameDate": game_date_str,
                },
            )

        if response.status_code != 200:
            logger.error(f"Failed to notify odds update. Status code: {response.status_code}")

    except Exception as e:
        logger.info(f"Failed to notify odds update: {e}")


def add_game(
    home_team: str,
    away_team: str,
    home_spread_odds: float,
    away_spread_odds: float,
    home_spread: float,
    home_moneyline: float,
    away_moneyline: float,
    over_under: float,
    over_odds: float,
    under_odds: float,
    game_date: date,
) -> Game:
    with Session() as session:

        try:
            game_exists = (
                session.query(Game)
                .filter(
                    and_(
                        Game.home_team == home_team, 
                        Game.away_team == away_team,
                        Game.game_date == game_date
                    )
                )
                .count() > 0)
            # Check if game exists and update in one step
            result = (
                session.query(Game)
                .filter(
                    and_(
                        Game.home_team == home_team,
                        Game.away_team == away_team,
                        Game.game_date == game_date,
                    )
                )
                .update(
                    {
                        Game.home_spread_odds: home_spread_odds,
                        Game.away_spread_odds: away_spread_odds,
                        Game.home_spread: home_spread,
                        Game.home_moneyline: home_moneyline,
                        Game.away_moneyline: away_moneyline,
                        Game.over_under: over_under,
                        Game.over_odds: over_odds,
                        Game.under_odds: under_odds,
                        Game.updated_at: func.now(),  # Force update to change updated_at
                    },
                    synchronize_session=False,
                )
            )

            if result > 0:
                session.commit()

                # Fetch the updated game
                updated_game = (
                    session.query(Game)
                    .filter(
                        and_(
                            Game.home_team == home_team,
                            Game.away_team == away_team,
                            Game.game_date == game_date,
                        )
                    )
                    .first()
                )

                # Notify WebSocket server
                notify_odds_update(updated_game)

                return updated_game
            else:
                # Create new game with all information
                new_game = Game(
                    home_team=home_team,
                    away_team=away_team,
                    home_spread_odds=home_spread_odds,
                    away_spread_odds=away_spread_odds,
                    home_spread=home_spread,
                    opening_home_spread=home_spread,  # Set opening spread
                    home_moneyline=home_moneyline,
                    away_moneyline=away_moneyline,
                    over_under=over_under,
                    opening_over_under=over_under,  # Set opening over/under
                    over_odds=over_odds,
                    under_odds=under_odds,
                    game_date=game_date,
                )

                session.add(new_game)
                session.commit()

                # Notify WebSocket server
                notify_odds_update(new_game)

                return new_game

        except Exception as e:
            session.rollback()


def mark_stale_games_as_ended():
    logger.info(f"IN MARK STALE GAMES")
    with Session() as session:
        try:
            eastern = pytz.timezone("America/New_York")
            # Get current time in EST
            now = datetime.now(eastern)

            # Find games that haven't ended
            # and haven't been updated in last 10 minutes
            stale_games = (
                session.query(Game)
                .filter(
                    and_(
                        # we need game_id to get game info, like the score
                        Game.game_id != None,
                        Game.has_ended == False,
                        Game.updated_at < now - timedelta(minutes=10),
                    )
                )
                .all()
            )

            if stale_games:
                # Update the games
                for game in stale_games:
                    logging.info(
                        f"Marking game as ended: gameID is {game.game_id}, {game.away_team} @ {game.home_team} on {game.game_date}. SENDING IT TO FASTAPI TO PROCESS BETS...."
                    )
                    response = requests.post(
                        f"{FAST_API_URL}/games/{game.game_id}/process",
                        json={"gameId": game.game_id},
                    )
                    if response.status_code == 200:
                        game.has_ended = True
                        session.commit()
                        result = response.json()
                        logger.info(f"Success: {result['success']}")
                        logger.info(f"Message: {result['message']}")
                        logger.info(f"Game ID: {result['game_id']}")
                        notify_odds_update(game)
                    else:
                        logger.error(f"Error: Status code {response.status_code}")
                        logger.error(response.text)

                # session.commit()

        except Exception as e:
            logger.error(f"Error marking stale games as ended: {e}")
            session.rollback()
