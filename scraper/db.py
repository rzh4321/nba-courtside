from sqlalchemy import create_engine, text, Column, BigInteger, String, Numeric, DateTime, Date, ForeignKey, and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker, validates
from sqlalchemy.sql import func
from enum import Enum
from datetime import date
import os
from dotenv import load_dotenv

load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")


DATABASE_URL = f"postgresql+psycopg2://{USER}.{HOST}:{PASSWORD}@aws-0-us-east-2.pooler.supabase.com:{PORT}/{DBNAME}"

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as connection:
        print("Connection successful!")
except Exception as e:
    print(f"Failed to connect: {e}")



Base = declarative_base()

class Game(Base):
    __tablename__ = 'games'

    id = Column(BigInteger, primary_key=True)
    game_id = Column(String(255), nullable=False)
    home_team = Column(String(255), nullable=False)
    away_team = Column(String(255), nullable=False)
    home_spread_odds = Column(Numeric(6,2), nullable=True) 
    away_spread_odds = Column(Numeric(6,2), nullable=True)  
    home_spread = Column(Numeric(5,2), nullable=True)      
    opening_home_spread = Column(Numeric(5,2), nullable=True)
    home_moneyline = Column(Numeric(8,2), nullable=True)  
    away_moneyline = Column(Numeric(8,2), nullable=True) 
    opening_over_under = Column(Numeric(5,2), nullable=True)
    over_under = Column(Numeric(5,2), nullable=True)
    over_odds = Column(Numeric(6,2), nullable=True)       
    under_odds = Column(Numeric(6,2), nullable=True)     
    created_at = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York'"),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=text("CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York'"),
        onupdate=text("CURRENT_TIMESTAMP AT TIME ZONE 'America/New_York'"),
        nullable=False
    )
    game_date = Column(Date, nullable=False)

    def __repr__(self):
        return f"<Game(game_id={self.game_id}, home_team={self.home_team}, away_team={self.away_team}, game_date={self.game_date})>"

Session = sessionmaker(bind=engine)

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
             game_date: date) -> Game:
    session = Session()
    
    # Check if game already exists
    existing_game = session.query(Game).filter(
        and_(
            Game.home_team == home_team,
            Game.away_team == away_team,
            Game.game_date == game_date
        )
    ).first()

    try:
        if existing_game:
            # Update betting information except opening lines
            existing_game.home_spread_odds = home_spread_odds
            existing_game.away_spread_odds = away_spread_odds
            existing_game.home_spread = home_spread
            existing_game.home_moneyline = home_moneyline
            existing_game.away_moneyline = away_moneyline
            existing_game.over_under = over_under
            existing_game.over_odds = over_odds
            existing_game.under_odds = under_odds
            
            session.commit()
            return existing_game
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
                opening_over_under=over_under,    # Set opening over/under
                over_odds=over_odds,
                under_odds=under_odds,
                game_date=game_date
            )
            
            session.add(new_game)
            session.commit()
            return new_game

    except Exception as e:
        session.rollback()
        raise e

