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
  const activeOrPastGames = games.filter(
    (game) => game.gameStatus !== GAME_STATUS.NOT_STARTED,
  );
  const shouldRefreshStats = activeOrPastGames.some(
    (game) => game.gameStatus !== GAME_STATUS.ENDED,
  );
  gameIds = activeOrPastGames.map((game) => game.gameId);
  return { gameIds, shouldRefreshStats };
}
