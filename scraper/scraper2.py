from selenium import webdriver # type: ignore
from selenium.webdriver.common.by import By # type: ignore
from bs4 import BeautifulSoup # type: ignore
import time
import utils


driver = webdriver.Chrome()
url = """
https://www.actionnetwork.com/nba/odds
"""
driver.get(url)
# Wait for JavaScript to load (adjust time as necessary for your connection speed and site response time)
time.sleep(4)

# Get the page source and create BeautifulSoup object
html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')

table = soup.select('table tbody')

# Get all tr elements
rows = table[0].find_all('tr')

# Loop through rows two at a time using step=2
for i in range(0, len(rows), 2):
    game_row = rows[i]
    time_row = rows[i+1]
    
    # Get teams from spans within the a tag
    teams = game_row.find('a').find_all('span')
    away_team_name = utils.nba_teams_full[teams[1].text.strip()]
    home_team_name = utils.nba_teams_full[teams[3].text.strip()]
    
    # Get game time
    game_time = time_row.text.strip()
    print(f"Game Time: {game_time}")
    
    # Print divider after each pair
    print("-" * 50)

driver.quit()









class BetType(str, Enum):
    SPREAD_HOME = 'SPREAD_HOME'
    SPREAD_AWAY = 'SPREAD_AWAY'
    MONEYLINE_HOME = 'MONEYLINE_HOME'
    MONEYLINE_AWAY = 'MONEYLINE_AWAY'
    OVER = 'OVER'
    UNDER = 'UNDER'

class Bet(Base):
    __tablename__ = 'bets'
    
    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey('users.id'), nullable=False)
    game_id = Column(BigInteger, ForeignKey('games.id'), nullable=False)
    bet_type = Column(Enum(BetType), nullable=False)
    odds = Column(Numeric(5,2), nullable=False)
    amount_placed = Column(Numeric(10,2), nullable=False)
    total_payout = Column(Numeric(10,2), nullable=False)
    selected_line = Column(Numeric(5,2))
    placed_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(20), default='PENDING')

    # Relationships
    user = relationship('User', back_populates='bets')
    game = relationship('Game', back_populates='bets')

    @validates('amount_placed')
    def validate_amount(self, key, amount):
        if amount <= 0:
            raise ValueError("Bet amount must be positive")
        return amount

class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True)
    username = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    amount_deposited = Column(BigInteger, default=0, nullable=False)
    amount_placed = Column(BigInteger, default=0, nullable=False)
    amount_won = Column(BigInteger, default=0, nullable=False)
    bets_placed = Column(BigInteger, default=0, nullable=False)
    bets_won = Column(BigInteger, default=0, nullable=False)

    # Relationship with Bet table
    bets = relationship('Bet', back_populates='user')

    def __repr__(self):
        return f"<User(username={self.username}, bets_placed={self.bets_placed}, bets_won={self.bets_won})>"

    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username cannot be empty")
        return username

    @validates('password')
    def validate_password(self, key, password):
        if not password:
            raise ValueError("Password cannot be empty")
        return password