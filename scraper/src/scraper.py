from selenium import webdriver  # type: ignore
from selenium.webdriver.common.by import By  # type: ignore
from selenium.webdriver.chrome.options import Options  # type: ignore
from selenium.webdriver.support.ui import WebDriverWait  # type: ignore
from selenium.webdriver.support import expected_conditions as EC  # type: ignore
from selenium.common.exceptions import TimeoutException, WebDriverException  # type: ignore
from bs4 import BeautifulSoup  # type: ignore
import time
from . import utils
from .db import add_game, mark_stale_games_as_ended
from datetime import date, timedelta, datetime
import pytz  # type: ignore
import sys
import os
import logging

logger = logging.getLogger(__name__)

eastern = pytz.timezone("America/New_York")


def should_scrape():
    current_time = datetime.now(eastern)
    current_hour = current_time.hour
    current_minute = current_time.minute

    # Block the specific window from 11:58 PM to 12:01 AM (draftkings has incorrect dates)
    if (current_hour == 23 and current_minute >= 58) or (current_hour == 0 and current_minute <= 1):
        logger.error("It's between 11:58 PM and 12:01 AM, not running scraper")
        return False

    # Check if it's during typical NBA game hours (e.g., 11 AM - 2 AM ET)
    if current_hour >= 11 or current_hour < 2:
        return True

    logger.error("It's not between 11 AM and 2 AM, not running scraper")
    return False



def setup_driver():
    """
    Create and return a configured Selenium Chrome WebDriver.

    Design choices:
    - We prefer running non-headless to reduce bot signals. If you must run headless, set
      RUN_HEADLESS = True and use the minimal set of flags.
    - Keep flags to a minimum to avoid automation fingerprints.
    - Use a consistent user-agent that matches your Chrome build.
    - Set a page load timeout to avoid hanging indefinitely on navigation.
    """
    chrome_options = Options()
    RUN_HEADLESS = True
    if RUN_HEADLESS:
        # Use legacy headless for better compatibility:
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--window-size=1920,1080")

    else:
        chrome_options.add_argument("--window-size=1920,1080")

    # If running as root (e.g., in a container), Chrome requires --no-sandbox.
    # If you are not root, you can remove this.
    chrome_options.add_argument("--no-sandbox")

    # If your container has very small /dev/shm (common on Docker), Chrome can crash. Prefer to
    # increase /dev/shm size (e.g., docker run --shm-size=2g). If not possible, enable this:
    # chrome_options.add_argument("--disable-dev-shm-usage")

    chrome_options.add_argument(
        "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    )



    driver = webdriver.Chrome(options=chrome_options)

    # Set a global navigation timeout for get() and associated loads.
    driver.set_page_load_timeout(30)

    return driver

# def setup_driver(max_attempts=3):
#     for attempt in range(max_attempts):
#         try:
#             chrome_options = Options()
#             # Add timezone-specific arguments
#             chrome_options.add_argument('--timezone="America/New_York"')
#             # chrome_options.add_experimental_option(
#             #     "prefs",
#             #     {
#             #         "profile.default_content_setting_values.timezone": 1,
#             #         "profile.managed_default_content_settings.timezone": 1,
#             #         "profile.default_content_settings.timezone": 1,
#             #         "intl.accept_languages": "en-US,en",
#             #         "profile.content_settings.exceptions.timezone": {
#             #             "[*.]draftkings.com": {"setting": 1}
#             #         },
#             #     },
#             # )
#             chrome_options.add_argument("--headless")  # Use new headless mode
#             chrome_options.add_argument("--no-sandbox")
#             # chrome_options.add_argument("--disable-dev-shm-usage")
#             # chrome_options.add_argument("--disable-gpu")
#             # chrome_options.add_argument("--disable-extensions")
#             # chrome_options.add_argument("--disable-infobars")
#             # chrome_options.add_argument("--remote-debugging-port=9222")
#             chrome_options.add_argument("--window-size=1920,1080")
#             chrome_options.add_argument(
#         "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
#         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
#     )
#             # chrome_options.add_argument("--start-maximized")
#             # chrome_options.add_argument("--single-process")  # Add this
#             # chrome_options.add_argument(
#             #     "--disable-features=site-per-process"
#             # )  # Add this
#             # chrome_options.add_argument("--ignore-certificate-errors")
#             # chrome_options.add_argument("--disable-web-security")  # Add this
#             # chrome_options.add_argument(
#             #     "--disable-features=IsolateOrigins,site-per-process"
#             # )  # Add this

#             # # Set shared memory /dev/shm size
#             # chrome_options.add_argument("--disable-dev-shm-usage")
#             # chrome_options.add_argument("--shm-size=2gb")

#             # # Add performance options
#             # chrome_options.add_argument("--aggressive-cache-discard")
#             # chrome_options.add_argument("--disable-cache")
#             # chrome_options.add_argument("--disable-application-cache")
#             # chrome_options.add_argument("--disable-offline-load-stale-cache")
#             # chrome_options.add_argument("--disk-cache-size=0")

#             # # Memory management
#             # chrome_options.add_argument("--disable-backing-store-limit")
#             # chrome_options.add_argument("--disable-background-networking")
#             # chrome_options.add_argument(
#             #     "--disable-component-extensions-with-background-pages"
#             # )
#             # chrome_options.add_argument("--disable-default-apps")

#             driver = webdriver.Chrome(
#                 options=chrome_options,
#             )
#             driver.execute_cdp_cmd(
#                 "Emulation.setTimezoneOverride", {"timezoneId": "America/New_York"}
#             )
#             # Increase timeouts
#             driver.set_page_load_timeout(60)
#             driver.implicitly_wait(20)

#             # Test the driver
#             driver.execute_script("return document.readyState")
#             return driver

#         except Exception as e:
#             logger.error(f"Attempt {attempt + 1} failed: {str(e)}")
#             if "driver" in locals():
#                 try:
#                     driver.quit()
#                 except:
#                     pass

#             # Kill chrome processes and clean up
#             try:
#                 os.system("pkill -f chrome")
#                 os.system("pkill -f chromedriver")
#                 time.sleep(2)
#             except:
#                 pass

#             if attempt == max_attempts - 1:
#                 raise Exception(
#                     f"Failed to create driver after {max_attempts} attempts: {str(e)}"
#                 )

#             time.sleep(5 * (attempt + 1))


def scrape_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        driver = None
        try:
            driver = setup_driver()
            # Clear cookies and cache before loading page
            driver.execute_cdp_cmd("Network.clearBrowserCache", {})
            driver.execute_cdp_cmd("Network.clearBrowserCookies", {})

            driver.get(url)

            wait = WebDriverWait(driver, 30)
            wait.until(
                EC.presence_of_element_located((By.CLASS_NAME, "cms-zone"))
            )

            # Add additional wait for dynamic content
            time.sleep(8)

            html = driver.page_source
            if not html or len(html) < 1000:  # Basic check for valid content
                raise Exception("Retrieved HTML appears to be invalid")

            return driver, html

        except Exception as e:
            logger.error(f"Error on attempt {attempt + 1}: {str(e)}")
            if driver:
                try:
                    driver.quit()
                except:
                    pass

            # Clean up between attempts
            try:
                os.system("pkill -f chrome")
                os.system("pkill -f chromedriver")
                time.sleep(5)
            except:
                pass

            if attempt < max_retries - 1:
                time.sleep(10 * (attempt + 1))
            else:
                raise Exception(f"Failed after {max_retries} attempts")


def scrape_odds():
    if should_scrape():
        logger.info(f"CALLING MARK GAME AS STALE ....")
        mark_stale_games_as_ended()
        try:
            url = "https://sportsbook.draftkings.com/leagues/basketball/nba"
            driver, html = scrape_with_retry(url)
            soup = BeautifulSoup(html, "html.parser")
           
            parlay_divs = soup.select(".cms-market-selector-static__event-wrapper > div")[:2]

            # parlay div has class cb-static-parlay__wrapper
            for parlay_div in parlay_divs:
                # parlay_div has class cb-static-parlay__wrapper
                # get the date
                date_th = parlay_div.select_one(".cb-title__wrapper--parlay").text.strip().lower()
                today = datetime.now(eastern).date()

                # Determine game date based on thead text
                if date_th == "today":
                    game_date = today
                    logger.info(f"date is today. game_date is set to {game_date}")
                elif date_th == "tomorrow":
                    game_date = today + timedelta(days=1)
                    logger.info(f"date is tomorrow. game_date is set to {game_date}")
                else:
                    # Extract month and day from format like 'WED DEC 25TH'
                    date_parts = date_th.split()[1:]  # Skip the day of week
                    month_day = " ".join(date_parts)  # 'DEC 25TH'
                    # Remove 'TH', 'ST', 'ND', 'RD' from the day
                    month_day = re.sub(r"(?:ST|ND|RD|TH|st|nd|rd|th)$", "", month_day)
                    # Convert month to proper case (DEC -> Dec) for strptime
                    month_day = month_day.title()
                    logger.info(f"date is not today or tomorrow, its {month_day}")

                    try:
                        # Parse the date string
                        game_date = datetime.strptime(
                            f"{month_day} {date.today().year}", "%b %d %Y"
                        ).date()

                        # If the date is in the past, check if it's due to year change or day change
                        if game_date < today:
                            # If we're in January and the game date is in December, it's from last year
                            if today.month == 1 and game_date.month == 12:
                                game_date = datetime.strptime(
                                    f"{month_day} {today.year - 1}", "%b %d %Y"
                                ).date()
                            # If it's just the day that's behind (midnight transition), keep the same month/year
                            else:
                                game_date = game_date
                        logger.info(f"game date is set to {game_date}")

                    except ValueError as e:
                        logger.error(f"Error parsing date: {e}")
                        logger.error(f"Input date string was: '{month_day} {date.today().year}'")
                        raise
                
                # game_list_container has class cb-static-parlay__event-wrapper
                game_list_container = parlay_div.select_one(".cb-static-parlay__event-wrapper")

                game_divs = game_list_container.select(".cb-market__template--2-columns")

                # game_div hass class cb-market__template cb-market__template--2-columns
                for game_div in game_divs:
                    try:
                        # team_div has cb-side-column__left
                        team_div = game_div.select_one(":nth-child(1)")
                        # prcoess team names
                        import re
                        away_team_name = utils.nba_teams_full[re.sub(r'\d+$', '', team_div.select_one(":nth-child(1)").text.split()[-1].strip())]
                        home_team_name = utils.nba_teams_full[re.sub(r'\d+$', '', team_div.select_one(":nth-child(3)").text.split()[-1].strip())]

                        logger.info(f"Away team: {away_team_name}, Home team: {home_team_name}")

                        betting_divs = game_div.select_one(".cb-side-column__right")
                        betting_options = betting_divs.select(".cb-market__button")
                        # process spreads, moneylines, over/under
                        betting_info = {}
                        index_to_bet = {
                            0: {"betting_number": "away_spread", "betting_odds": "away_spread_odds"},
                            1: {"betting_number": "over_under", "betting_odds": "over_odds"},
                            2: {"betting_number": None, "betting_odds": "away_moneyline"},
                            3: {"betting_number": "home_spread", "betting_odds": "home_spread_odds"},
                            4: {"betting_number": "over_under", "betting_odds": "under_odds"},
                            5: {"betting_number": None, "betting_odds": "home_moneyline"}
                        }
                        for i, betting_option in enumerate(betting_options):
                            try:
                                if betting_option.select_one(":nth-child(2)") is None or betting_option.select_one(":nth-child(3)") is None:
                                    # bets are locked
                                    if index_to_bet[i]["betting_odds"] is not None:
                                        index_to_bet[i]["betting_odds"] = None
                                    if index_to_bet[i]["betting_number"] is not None:   
                                        index_to_bet[i]["betting_number"] = None 
                                        # im high rn is the code good
                                    continue
                                betting_number = betting_option.select_one(":nth-child(2)").text.strip()
                                betting_odds = betting_option.select_one(":nth-child(3)").text.strip()
                                # logger.info(f"i is {i}, betting number: {betting_number}, betting odds: {betting_odds}")
                                formatted_betting_number, formatted_betting_odds = utils.process_betting_option(i, betting_number, betting_odds)
                                if index_to_bet[i]["betting_number"] is not None:
                                    betting_info[index_to_bet[i]["betting_number"]] = formatted_betting_number
                                if index_to_bet[i]["betting_odds"] is not None:
                                    betting_info[index_to_bet[i]["betting_odds"]] = formatted_betting_odds
                            except Exception as e:
                                logger.error(f"\n\nError parsing betting option: {betting_option}\n\n")
                                # move on to next bet type
                                continue
                                    
                        logger.info(f"Away: {away_team_name}")
                        logger.info(f"Away Spread: {betting_info.get('away_spread')}")
                        logger.info(f"Away Spread Odds: {betting_info.get('away_spread_odds')}")
                        logger.info(f"Away Moneyline: {betting_info.get('away_moneyline')}")
                        logger.info(f"Home: {home_team_name}")
                        logger.info(f"Home Spread: {betting_info.get('home_spread')}")
                        logger.info(f"Home Spread Odds: {betting_info.get('home_spread_odds')}")
                        logger.info(f"Home Moneyline: {betting_info.get('home_moneyline')}")
                        logger.info(f"Over/Under Number: {betting_info.get('over_under')}")
                        logger.info(f"Over Odds: {betting_info.get('over_odds')}")
                        logger.info(f"Under Odds: {betting_info.get('under_odds')}")
                        logger.info("---\n")
                        # Add or update game
                        add_game(
                            home_team=home_team_name,
                            away_team=away_team_name,
                            home_spread_odds=betting_info.get("home_spread_odds"),
                            away_spread_odds=betting_info.get("away_spread_odds"),
                            home_spread=betting_info.get("home_spread"),
                            home_moneyline=betting_info.get("home_moneyline"),
                            away_moneyline=betting_info.get("away_moneyline"),
                            over_under=betting_info.get("over_under"),
                            over_odds=betting_info.get("over_odds"),
                            under_odds=betting_info.get("under_odds"),
                            game_date=game_date,
                        )
                    except Exception as e:
                        logger.error(f"Error: {e}")
                        continue  # Skip this game and continue with the next one

        except Exception as e:
            logger.error(f"Fatal error: {e}")
            sys.exit(1)
        finally:
            if "driver" in locals():
                try:
                    driver.quit()
                except:
                    pass
