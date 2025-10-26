const host = "https://cdn.nba.com";
export const scheduleUrl = `${host}/static/json/staticData/scheduleLeagueV2_1.json`;
const scoreboardUrl = `${host}/static/json/liveData/scoreboard/todaysScoreboard_00.json`;
const boxscoreUrl = (gameId: string) => {
  return `${host}/static/json/liveData/boxscore/boxscore_${gameId}.json`;
};
import { API } from "./constants";
import { parseGames } from "./utils/mappers";
import { LeagueScheduleResponse } from "./types";

// revalidate api fetches every 20 seconds
export const getLeagueSchedule = async () => {
  const res = await fetch(scheduleUrl, { cache: "no-store" });
  const data = await res.json();
  return data;
};

export const getScoreboard = async () => {
  const res = await fetch(scoreboardUrl, { next: { revalidate: 20 } });
  const data = await res.json();
  return data;
};

export const getBoxscore = async (gameId: string) => {
  const res = await fetch(boxscoreUrl(gameId), { next: { revalidate: 20 } });
  const data = await res.json();
  return data.game;
};

export const getGamesFromLeagueSchedule = (
  leagueSchedule: LeagueScheduleResponse,
  date: string,
) => {
  const allGames = leagueSchedule.leagueSchedule.gameDates;
  for (let gameDate of allGames) {
    const extractedDate = gameDate.gameDate.split(" ")[0];
    const isoDate = (([m, d, y]) =>
      `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`)(
      extractedDate.split("/"),
    );
    gameDate.games.forEach((game) => {
      game.gameTimeUTC = game.gameDateTimeUTC; // fix the gameTimeUTC (for some reason its set to 1900)
    });
    if (isoDate === date) {
      return parseGames(gameDate.games);
    }
  }
  return [];
};

export const getScoreboards = async (date?: string) => {
  if (date) {
    // fetch from league schedule API for historical dates
    const data = await getLeagueSchedule();
    return getGamesFromLeagueSchedule(data, date);
  } else {
    console.log("getting todays scoreboard....");
    const res = await fetch(
      `${API.DETAILS_URL}/scoreboard/todaysScoreboard_00.json`,
      {
        cache: "no-store",
      },
    );

    const data = await res.json();
    return parseGames(data.scoreboard.games);
  }
};
