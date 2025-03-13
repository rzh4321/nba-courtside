"use server";
import getScoreboards from "./getScoreboards";
import { GAME_STATUS } from "@/constants";
import { DATE_LINK_FORMAT } from "@/constants";
import { format } from "date-fns";

export default async function getGameIds(date: string) {
  const today = format(new Date(), DATE_LINK_FORMAT);
  let gameIds;
  let games;
  // TODO: use API endpoint instead, delete this function entirely
  if (date === today) {
    games = await getScoreboards();
  } else {
    games = await getScoreboards(date);
  }
  let areGamesFromDate = true;
  if (
    games.length > 0 &&
    games.at(0)?.gameTimeUTC.toString().split("T")[0] !== date
  ) {
    // if true, its still returning yesterdays games for today (bc its like 2 AM)
    areGamesFromDate = false;
  }
  const activeOrPastGames = games.filter(
    (game) => game.gameStatus !== GAME_STATUS.NOT_STARTED,
  );
  const shouldRefreshStats = activeOrPastGames.some(
    (game) => game.gameStatus !== GAME_STATUS.ENDED,
  );
  gameIds = activeOrPastGames.map((game) => game.gameId);
  return { gameIds, shouldRefreshStats, areGamesFromDate };
}
