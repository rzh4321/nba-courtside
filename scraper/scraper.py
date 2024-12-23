from selenium import webdriver # type: ignore
from selenium.webdriver.common.by import By # type: ignore
from selenium.webdriver.chrome.options import Options # type: ignore
from bs4 import BeautifulSoup # type: ignore
import time
import utils
from db import add_game
import re
from datetime import date, timedelta, datetime


chrome_options = Options()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')
chrome_options.add_argument('--disable-gpu')  # Required for headless mode
chrome_options.add_argument('--window-size=1920,1080')  # Set window size

driver = webdriver.Chrome(options=chrome_options)
# driver = webdriver.Chrome()
url = """
https://sportsbook.draftkings.com/leagues/basketball/nba
"""
driver.get(url)
time.sleep(4)

html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')

# Find first div with class starting with "parlay-card-"
parlay_div = soup.find('div', class_=lambda x: x and x.startswith('parlay-card-'))

# Get the tbody within this div
games = parlay_div.find('tbody')

# Get all tr elements
tr_elements = games.find_all('tr')
print(len(tr_elements))


# Get the thead element
thead = parlay_div.find('thead')
date_th = thead.find('tr').find('th').text.strip().lower()

# Determine game date based on thead text
if date_th == 'today':
    game_date = date.today()
elif date_th == 'tomorrow':
    game_date = date.today() + timedelta(days=1)
else:
    # Extract month and day from format like 'WED DEC 25TH'
    date_parts = date_th.split()[1:]  # Skip the day of week
    month_day = ' '.join(date_parts)  # 'DEC 25TH'
    # Remove 'TH', 'ST', 'ND', 'RD' from the day
    month_day = re.sub(r'(?:ST|ND|RD|TH)$', '', month_day)
    # Parse the date string
    game_date = datetime.strptime(f"{month_day} {date.today().year}", "%b %d %Y").date()
    # If the date is in the past (December -> January transition), add a year
    if game_date < date.today():
        game_date = datetime.strptime(f"{month_day} {date.today().year + 1}", "%b %d %Y").date()

print('game date is: ', game_date)
try:
    # Iterate through pairs of tr elements
    for i in range(0, len(tr_elements), 2):
        # Process first tr (away team)
        away_team_row = tr_elements[i]
        away_team_name = utils.nba_teams_full[away_team_row.find('a').text.strip().split()[-1]]
        
        # Get first td for away team (spread)
        away_spread_td = away_team_row.find('td')
        away_spread_divs = away_spread_td.find('div').find('div').find('div').find_all('div')
        away_spread = away_spread_divs[0].text.strip()
        away_spread_odds = away_spread_divs[1].text.strip()
        
        # Get second td for away team (over)
        over_td = away_team_row.find_all('td')[1]
        over_total_div = over_td.find('div').find('div').find('div')
        over_total_divs = over_total_div.find_all('div')
        over_under_number = over_total_divs[0].find_all('span')[2].text.strip()
        over_odds = over_total_divs[1].text.strip()
        
        # Get third td for away team (moneyline)
        away_moneyline_td = away_team_row.find_all('td')[2]
        away_moneyline = away_moneyline_td.find('div').text.strip()
        
        # Process second tr (home team)
        home_team_row = tr_elements[i+1]
        home_team_name = utils.nba_teams_full[home_team_row.find('a').text.strip().split()[-1]]
        
        # Get first td for home team (spread)
        home_spread_td = home_team_row.find('td')
        home_spread_divs = home_spread_td.find('div').find('div').find('div').find_all('div')
        home_spread = home_spread_divs[0].text.strip()
        home_spread_odds = home_spread_divs[1].text.strip()
        
        # Get second td for home team (under)
        under_td = home_team_row.find_all('td')[1]
        under_total_div = under_td.find('div').find('div').find('div')
        under_total_divs = under_total_div.find_all('div')
        under_odds = under_total_divs[1].text.strip()
        
        # Get third td for home team (moneyline)
        home_moneyline_td = home_team_row.find_all('td')[2]
        home_moneyline = home_moneyline_td.find('div').text.strip()
        
        print(f"Away: {away_team_name}")
        print(f"Away Spread: {away_spread}")
        print(f"Away Spread Odds: {away_spread_odds}")
        print(f"Away Moneyline: {away_moneyline}")
        print(f"Home: {home_team_name}")
        print(f"Home Spread: {home_spread}")
        print(f"Home Spread Odds: {home_spread_odds}")
        print(f"Home Moneyline: {home_moneyline}")
        print(f"Over/Under Number: {over_under_number}")
        print(f"Over Odds: {over_odds}")
        print(f"Under Odds: {under_odds}")
        print("---")

        # Convert string values to appropriate numeric types
        home_spread_num = utils.convert_spread(home_spread)
        away_spread_num = utils.convert_spread(away_spread)
        home_spread_odds_num = utils.convert_odds(home_spread_odds)
        away_spread_odds_num = utils.convert_odds(away_spread_odds)
        home_moneyline_num = utils.convert_odds(home_moneyline)
        away_moneyline_num = utils.convert_odds(away_moneyline)
        over_under_num = float(over_under_number)
        over_odds_num = utils.convert_odds(over_odds)
        under_odds_num = utils.convert_odds(under_odds)

        # Add game to database
        add_game(
            home_team=home_team_name,
            away_team=away_team_name,
            home_spread_odds=home_spread_odds_num,
            away_spread_odds=away_spread_odds_num,
            home_spread=home_spread_num,
            home_moneyline=home_moneyline_num,
            away_moneyline=away_moneyline_num,
            over_under=over_under_num,
            over_odds=over_odds_num,
            under_odds=under_odds_num,
            game_date=game_date
        )
finally:
    driver.quit()