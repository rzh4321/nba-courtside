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







