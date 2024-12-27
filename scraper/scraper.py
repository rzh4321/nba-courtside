from selenium import webdriver # type: ignore
from selenium.webdriver.common.by import By # type: ignore
from selenium.webdriver.chrome.options import Options # type: ignore
from selenium.webdriver.support.ui import WebDriverWait # type: ignore
from selenium.webdriver.support import expected_conditions as EC # type: ignore
from selenium.common.exceptions import TimeoutException, WebDriverException # type: ignore
from bs4 import BeautifulSoup # type: ignore
import time
import utils
from db import add_game
import re
from datetime import date, timedelta, datetime
import pytz # type: ignore
import sys
import os

eastern = pytz.timezone('America/New_York')
today = datetime.now(eastern).date()
def should_scrape():
    current_time = datetime.now(eastern)
    # Check if it's during typical NBA game hours (e.g., 11 AM - 2 AM ET)
    if current_time.hour >= 11 or current_time.hour < 2:
        return True
    print(f'its not beween 11 am and 2 am, not running scraper')
    return False

def setup_driver(max_attempts=3):
    for attempt in range(max_attempts):
        try:
            chrome_options = Options()
            chrome_options.add_argument('--headless')
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-gpu')
            chrome_options.add_argument('--dns-prefetch-disable')
            chrome_options.add_argument('--disable-extensions')
            chrome_options.add_argument('--disable-infobars')
            chrome_options.add_argument('--disable-setuid-sandbox')
            chrome_options.add_argument('--disable-software-rasterizer')
            chrome_options.add_argument('--ignore-certificate-errors')
            chrome_options.add_argument('--disable-browser-side-navigation')
            chrome_options.add_argument('--dns-prefetch-disable')
            chrome_options.add_argument('--disable-features=VizDisplayCompositor')
            chrome_options.add_argument('--window-size=1920,1080')
            chrome_options.add_argument('--start-maximized')
            chrome_options.add_argument('--force-device-scale-factor=1')
            chrome_options.add_argument('--timezone="America/New_York"')
            chrome_options.add_argument('--remote-debugging-port=9222')  # Add this line
            chrome_options.add_argument('--disable-background-networking')
            chrome_options.add_argument('--disable-default-apps')
            chrome_options.add_argument('--disable-sync')
            chrome_options.add_argument('--disable-translate')
            chrome_options.add_argument('--hide-scrollbars')
            chrome_options.add_argument('--metrics-recording-only')
            chrome_options.add_argument('--mute-audio')
            chrome_options.add_argument('--no-first-run')
            chrome_options.add_argument('--safebrowsing-disable-auto-update')
            chrome_options.add_argument('--log-level=3')  # Minimal logging
            chrome_options.add_experimental_option('prefs', {
                'profile.default_content_setting_values.timezone': 1,
                'profile.managed_default_content_settings.timezone': 1,
                'profile.default_content_settings.timezone': 1,
                'intl.accept_languages': 'en-US,en',
                'profile.content_settings.exceptions.timezone': {
                    '[*.]draftkings.com': {'setting': 1}
                }
            })

            # Create a service with specific timeout
            from selenium.webdriver.chrome.service import Service
            service = Service(
                log_output=os.path.devnull,  # Suppress service logs
                service_args=['--verbose']
            )

            driver = webdriver.Chrome(
                options=chrome_options,
                service=service
            )
            
            driver.set_page_load_timeout(30)
            
            # Test the driver with a simple command
            driver.execute_script('return document.readyState')
            
            # If we get here, driver is working
            return driver
            
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {str(e)}")
            if 'driver' in locals():
                try:
                    driver.quit()
                except:
                    pass
            
            # Kill any hanging chrome processes
            try:
                os.system("pkill -f chrome")
                time.sleep(2)
            except:
                pass
            
            if attempt == max_attempts - 1:
                raise Exception(f"Failed to create driver after {max_attempts} attempts: {str(e)}")
            
            time.sleep(5 * (attempt + 1))  # Exponential backoff

def scrape_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            driver = setup_driver()
            driver.get(url)
            
            # Wait for some element that indicates the page is loaded
            wait = WebDriverWait(driver, 20)
            # Replace with an element that should be present when page is loaded
            wait.until(EC.presence_of_element_located((By.CLASS_NAME, "sportsbook-table")))
            
            time.sleep(4)  # Keep your existing sleep
            
            html = driver.page_source
            return driver, html
            
        except TimeoutException as e:
            print(f"Timeout on attempt {attempt + 1}: {e}")
        except WebDriverException as e:
            print(f"WebDriver error on attempt {attempt + 1}: {e}")
        except Exception as e:
            print(f"Unexpected error on attempt {attempt + 1}: {e}")
        
        if driver:
            try:
                driver.quit()
            except:
                pass
            
        if attempt < max_retries - 1:
            time.sleep(10 * (attempt + 1))  # Exponential backoff
        else:
            print("Max retries reached, exiting")
            sys.exit(1)

if should_scrape():
    try:
        url = "https://sportsbook.draftkings.com/leagues/basketball/nba"
        driver, html = scrape_with_retry(url)
        soup = BeautifulSoup(html, 'html.parser')
    

        # Find first div with class starting with "parlay-card-"
        parlay_div = soup.find('div', class_=lambda x: x and x.startswith('parlay-card-'))

        # Get the tbody within this div
        games = parlay_div.find('tbody')

        # Get all tr elements
        tr_elements = games.find_all('tr')


        # Get the thead element
        thead = parlay_div.find('thead')
        date_th = thead.find('tr').find('th').text.strip().lower()

        # Determine game date based on thead text
        if date_th == 'today':
            game_date = today
            print('date is today. game_date is set to ', game_date)
        elif date_th == 'tomorrow':
            game_date = today + timedelta(days=1)
            print('date is tomorrow. game_date is set to ', game_date)
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
            print(f'date is not today or tomorrow, its {date_parts}. game_date is set to {game_date}')


        print(f'no of games is {len(games)/2}')
        # Iterate through pairs of tr elements
        for i in range(0, len(tr_elements), 2):
            try:
                # Process first tr (away team)
                away_team_row = tr_elements[i]
                # print(utils.nba_teams_full[away_team_row.find('a').find('div').find_all('div', recursive=False)[1].find('div').text.strip().split()[-1]])
                away_team_name = utils.nba_teams_full[away_team_row.find('a').find('div').find_all('div', recursive=False)[1].find('div').text.strip().split()[-1]]
                # away_team_name = utils.nba_teams_full[away_team_row.find('a').text.strip().split()[-1]]

                
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
                home_team_name = utils.nba_teams_full[home_team_row.find('a').find('div').find_all('div', recursive=False)[1].find('div').text.strip().split()[-1]]
                
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

                home_spread_num = utils.convert_spread(home_spread) if home_spread.strip() else None
                away_spread_num = utils.convert_spread(away_spread) if away_spread.strip() else None
                home_spread_odds_num = utils.convert_odds(home_spread_odds) if home_spread_odds.strip() else None
                away_spread_odds_num = utils.convert_odds(away_spread_odds) if away_spread_odds.strip() else None
                home_moneyline_num = utils.convert_odds(home_moneyline) if home_moneyline.strip() else None
                away_moneyline_num = utils.convert_odds(away_moneyline) if away_moneyline.strip() else None
                over_under_num = float(over_under_number) if over_under_number.strip() else None
                over_odds_num = utils.convert_odds(over_odds) if over_odds.strip() else None
                under_odds_num = utils.convert_odds(under_odds) if under_odds.strip() else None
            except Exception as e:
                print(f"Error: {e}")
                continue  # Skip this game and continue with the next one   

            # Add or update game
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
    except Exception as e:
        print(f"Fatal error: {e}")
        sys.exit(1)
    finally:
        if 'driver' in locals():
            try:
                driver.quit()
            except:
                pass
