export const API = {
  BASE_URL: "https://proxy.boxscores.site/?apiUrl=stats.nba.com/stats",
  DETAILS_URL: "https://cdn.nba.com/static/json/liveData",
};

export const COVID_YEAR = 2020;
export const COVID_MONTH_END = 9;
export const REGULAR_MONTH_END = 5;
export const REGULAR_PERIOD_COUNT = 4;

export const DATE_DISPLAY_FORMAT = "dd MMMM yyyy";
export const DATE_LINK_FORMAT = "yyyy-MM-dd";
export const DATE_TITLE_FORMAT = "dd/MM/yyyy";

export const AWAY_TEAM = "awayTeam";
export const HOME_TEAM = "homeTeam";

export const EAST_CONFERENCE = "east";
export const WEST_CONFERENCE = "west";
export const CONFERENCE_KEY = "conference";

export const GAME_STATUS = {
  NOT_STARTED: 1,
  IN_PROGRESS: 2,
  ENDED: 3,
};

export const PRIORITY = {
  [GAME_STATUS.IN_PROGRESS]: 0,
  [GAME_STATUS.NOT_STARTED]: 1,
  [GAME_STATUS.ENDED]: 2,
};

export const teamIds = {
  "Denver Nuggets": "1610612743",
  "Boston Celtics": "1610612738",
  "Atlanta Hawks": "1610612737",
  "Orlando Magic": "1610612753",
  "Golden State Warriors": "1610612744",
  "Memphis Grizzlies": "1610612763",
  "Washington Wizards": "1610612764",
  "Charlotte Hornets": "1610612766",
  "Philadelphia 76ers": "1610612755",
  "Brooklyn Nets": "1610612751",
  "Toronto Raptors": "1610612761",
  "Miami Heat": "1610612748",
  "Chicago Bulls": "1610612741",
  "Detroit Pistons": "1610612765",
  "Milwaukee Bucks": "1610612749",
  "Indiana Pacers": "1610612754",
  "New York Knicks": "1610612752",
  "Cleveland Cavaliers": "1610612739",
  "Dallas Mavericks": "1610612742",
  "Houston Rockets": "1610612745",
  "Los Angeles Clippers": "1610612746",
  "Los Angeles Lakers": "1610612747",
  "Minnesota Timberwolves": "1610612750",
  "New Orleans Pelicans": "1610612740",
  "Oklahoma City Thunder": "1610612760",
  "Phoenix Suns": "1610612756",
  "Portland Trail Blazers": "1610612757",
  "Sacramento Kings": "1610612758",
  "San Antonio Spurs": "1610612759",
  "Utah Jazz": "1610612762",
};
