nba_teams_full = {
    "76ers": "Philadelphia 76ers",
    "Bucks": "Milwaukee Bucks",
    "Bulls": "Chicago Bulls",
    "Cavaliers": "Cleveland Cavaliers", 
    "Celtics": "Boston Celtics",
    "Clippers": "Los Angeles Clippers",
    "Grizzlies": "Memphis Grizzlies",
    "Hawks": "Atlanta Hawks",
    "Heat": "Miami Heat",
    "Hornets": "Charlotte Hornets",
    "Jazz": "Utah Jazz",
    "Kings": "Sacramento Kings",
    "Knicks": "New York Knicks",
    "Lakers": "Los Angeles Lakers",
    "Magic": "Orlando Magic",
    "Mavericks": "Dallas Mavericks",
    "Nets": "Brooklyn Nets",
    "Nuggets": "Denver Nuggets",
    "Pacers": "Indiana Pacers",
    "Pelicans": "New Orleans Pelicans",
    "Pistons": "Detroit Pistons",
    "Raptors": "Toronto Raptors",
    "Rockets": "Houston Rockets",
    "Spurs": "San Antonio Spurs",
    "Suns": "Phoenix Suns",
    "Thunder": "Oklahoma City Thunder",
    "Timberwolves": "Minnesota Timberwolves",
    "Blazers": "Portland Trail Blazers",
    "Warriors": "Golden State Warriors",
    "Wizards": "Washington Wizards"
}

def convert_odds(odds_str: str) -> float:
    """Convert odds string to decimal number"""
    odds_str = odds_str.strip()
    if odds_str.startswith('−'):  # Handle minus sign
        odds_str = '-' + odds_str[1:]
    return float(odds_str)

def convert_spread(spread_str: str) -> float:
    """Convert spread string to decimal number"""
    if spread_str.startswith('−'):  # Handle minus sign
        spread_str = '-' + spread_str[1:]
    return float(spread_str)