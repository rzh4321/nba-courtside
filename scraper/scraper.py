from selenium import webdriver # type: ignore
from selenium.webdriver.common.by import By # type: ignore
from bs4 import BeautifulSoup # type: ignore
import time
import utils


driver = webdriver.Chrome()
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

driver.quit()