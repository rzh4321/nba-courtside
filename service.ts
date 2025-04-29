const host = "https://cdn.nba.com";
const scheduleUrl = `${host}/static/json/staticData/scheduleLeagueV2_1.json`;
const scoreboardUrl = `${host}/static/json/liveData/scoreboard/todaysScoreboard_00.json`;
const boxscoreUrl = (gameId: string) =>
  `${host}/static/json/liveData/boxscore/boxscore_${gameId}.json`;
import { API } from "./constants";
import { parseGames } from "./utils/mappers";

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
  console.log("in getboxscore");
  const res = await fetch(boxscoreUrl(gameId), { next: { revalidate: 20 } });
  const data = await res.json();
  console.log("data is ", data);
  return data.game;
};

export const getScoreboards = async (date?: string) => {
  if (date) {
    console.log(
      `url: ${API.BASE_URL}/scoreboardv3&GameDate=${date}&LeagueID=00`,
    );
    const res = await fetch(
      `${API.BASE_URL}/scoreboardv3&GameDate=${date}&LeagueID=00`,
      {
        cache: "no-store",
      },
    );

    const data = await res.json();
    return parseGames(data);
  } else {
    console.log("getting todays scoreboard....");
    const res = await fetch(
      `${API.DETAILS_URL}/scoreboard/todaysScoreboard_00.json`,
      {
        cache: "no-store",
      },
    );

    const data = await res.json();
    return parseGames(data);
  }
};
