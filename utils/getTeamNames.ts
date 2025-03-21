interface TeamInfo {
  city: string;
  name: string;
}

export const nbaTeams: Record<string, TeamInfo> = {
  "Atlanta Hawks": { city: "ATL", name: "Hawks" },
  "Boston Celtics": { city: "BOS", name: "Celtics" },
  "Brooklyn Nets": { city: "BKN", name: "Nets" },
  "Charlotte Hornets": { city: "CHA", name: "Hornets" },
  "Chicago Bulls": { city: "CHI", name: "Bulls" },
  "Cleveland Cavaliers": { city: "CLE", name: "Cavaliers" },
  "Dallas Mavericks": { city: "DAL", name: "Mavericks" },
  "Denver Nuggets": { city: "DEN", name: "Nuggets" },
  "Detroit Pistons": { city: "DET", name: "Pistons" },
  "Golden State Warriors": { city: "GSW", name: "Warriors" },
  "Houston Rockets": { city: "HOU", name: "Rockets" },
  "Indiana Pacers": { city: "IND", name: "Pacers" },
  "Los Angeles Clippers": { city: "LAC", name: "Clippers" },
  "Los Angeles Lakers": { city: "LAL", name: "Lakers" },
  "Memphis Grizzlies": { city: "MEM", name: "Grizzlies" },
  "Miami Heat": { city: "MIA", name: "Heat" },
  "Milwaukee Bucks": { city: "MIL", name: "Bucks" },
  "Minnesota Timberwolves": { city: "MIN", name: "Timberwolves" },
  "New Orleans Pelicans": { city: "NOP", name: "Pelicans" },
  "New York Knicks": { city: "NYK", name: "Knicks" },
  "Oklahoma City Thunder": { city: "OKC", name: "Thunder" },
  "Orlando Magic": { city: "ORL", name: "Magic" },
  "Philadelphia 76ers": { city: "PHI", name: "76ers" },
  "Phoenix Suns": { city: "PHX", name: "Suns" },
  "Portland Trail Blazers": { city: "POR", name: "Trail Blazers" },
  "Sacramento Kings": { city: "SAC", name: "Kings" },
  "San Antonio Spurs": { city: "SAS", name: "Spurs" },
  "Toronto Raptors": { city: "TOR", name: "Raptors" },
  "Utah Jazz": { city: "UTA", name: "Jazz" },
  "Washington Wizards": { city: "WAS", name: "Wizards" },
};

export const fullNbaTeams: { [key: string]: string } = {
  Hawks: "Atlanta Hawks",
  Celtics: "Boston Celtics",
  Nets: "Brooklyn Nets",
  Hornets: "Charlotte Hornets",
  Bulls: "Chicago Bulls",
  Cavaliers: "Cleveland Cavaliers",
  Mavericks: "Dallas Mavericks",
  Nuggets: "Denver Nuggets",
  Pistons: "Detroit Pistons",
  Warriors: "Golden State Warriors",
  Rockets: "Houston Rockets",
  Pacers: "Indiana Pacers",
  Clippers: "Los Angeles Clippers",
  Lakers: "Los Angeles Lakers",
  Grizzlies: "Memphis Grizzlies",
  Heat: "Miami Heat",
  Bucks: "Milwaukee Bucks",
  Timberwolves: "Minnesota Timberwolves",
  Pelicans: "New Orleans Pelicans",
  Knicks: "New York Knicks",
  Thunder: "Oklahoma City Thunder",
  Magic: "Orlando Magic",
  "76ers": "Philadelphia 76ers",
  Suns: "Phoenix Suns",
  "Trail Blazers": "Portland Trail Blazers",
  Kings: "Sacramento Kings",
  Spurs: "San Antonio Spurs",
  Raptors: "Toronto Raptors",
  Jazz: "Utah Jazz",
  Wizards: "Washington Wizards",
};
