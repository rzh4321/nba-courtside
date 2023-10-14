const host = "https://cdn.nba.com";
const scheduleUrl = `${host}/static/json/staticData/scheduleLeagueV2_1.json`;
const scoreboardUrl = `${host}/static/json/liveData/scoreboard/todaysScoreboard_00.json`;
const boxscoreUrl = (gameId: string) =>
  `${host}/static/json/liveData/boxscore/boxscore_${gameId}.json`;

// revalidate api fetches every 20 seconds
export const getLeagueSchedule = async () => {
  const res = await fetch(scheduleUrl, { next: { revalidate: 20 } });
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
  return data;
};
