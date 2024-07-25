import { Games, Team, Game, NBATeamAcronyms } from '@/types';
import { PRIORITY } from '@/constants';


export const orderByStatus = (
    a: Pick<Game, "gameStatus">,
    b: Pick<Game, "gameStatus">,
  ) => {
    return PRIORITY[a.gameStatus] - PRIORITY[b.gameStatus];
  };
  

export type ParsedGames = ReturnType<typeof parseGames>;

export const parseGames = (data: Games | undefined) => {
  if (data === undefined) return [];
  const {
    scoreboard: { games },
  } = data;

  const getTeamData = (team: Team) => {
    return {
      teamId: team.teamId,
      teamName: team.teamName,
      teamTricode: team.teamTricode,
      wins: team.wins,
      losses: team.losses,
      score: team.score,
    };
  };

  return games.sort(orderByStatus).map((game) => {
    const {
      gameId,
      gameStatus,
      gameStatusText,
      period,
      gameClock,
      gameTimeUTC,
      homeTeam,
      awayTeam,
    } = game;

    return {
      gameId,
      gameStatus,
      gameStatusText,
      period,
      gameClock,
      gameTimeUTC,
      homeTeam: getTeamData(homeTeam),
      awayTeam: getTeamData(awayTeam),
    };
  });
};

export type StandingsData = {
  resultSets: ResultSet[];
};

type ResultSet = {
  name: string;
  headers: string[];
  rowSet: Array<Array<number | string>>;
};

export type Conference = ReturnType<typeof conferenceExtractor>;

export const conferenceExtractor = (
  teams: ResultSet["rowSet"],
  isEast: boolean,
) =>
  teams
    .filter((team) => (isEast ? team[6] === "East" : team[6] === "West"))
    .map((team) => ({
      name: team[4] as string,
      id: team[2],
      playoffCode: team[9],
      win: team[13],
      loss: team[14],
      percentage: team[15],
      gamesBehind: team[38],
      homeRecord: team[18],
      awayRecord: team[19],
      lastTenRecord: team[20],
      streak: team[36],
    }));


  export const nbaTeamAcronyms : NBATeamAcronyms = {
      "76ers": "PHI",
      "bucks": "MIL",
      "bulls": "CHI",
      "cavaliers": "CLE",
      "celtics": "BOS",
      "clippers": "LAC",
      "grizzlies": "MEM",
      "hawks": "ATL",
      "heat": "MIA",
      "hornets": "CHA",
      "jazz": "UTA",
      "kings": "SAC",
      "knicks": "NYK",
      "lakers": "LAL",
      "magic": "ORL",
      "mavericks": "DAL",
      "nets": "BKN",
      "nuggets": "DEN",
      "pacers": "IND",
      "pelicans": "NOP",
      "pistons": "DET",
      "raptors": "TOR",
      "rockets": "HOU",
      "spurs": "SAS",
      "suns": "PHX",
      "thunder": "OKC",
      "timberwolves": "MIN",
      "trail blazers": "POR",
      "warriors": "GSW",
      "wizards": "WAS"
    };