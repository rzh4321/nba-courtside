"use server";
import { getScoreboards } from "@/service";
import { GAME_STATUS } from "@/constants";
import { DATE_LINK_FORMAT } from "@/constants";
import { format } from "date-fns";
import parse from "date-fns/parse";
import { NextRequest, NextResponse } from "next/server";

// retrieve the gameIds from the given date
export async function GET(
  req: NextRequest,
  context: { params: { date: string } },
) {
  const date = context.params.date;
  // date is either a selected date or last played game date (could be today)
  const formattedDate = format(
    parse(date!, "MM-dd-yyyy", new Date()),
    "yyyy-MM-dd",
  );
  const today = format(new Date(), DATE_LINK_FORMAT);
  let gameIds;
  let games: any[] = [];
  if (formattedDate === today) {
    // no param means it will call the endpoint for todays scoreboards
    games = await getScoreboards();
  } else {
    games = await getScoreboards(formattedDate);
  }
  let areGamesFromDate = true;
  if (
    games.length > 0 &&
    games.at(0)?.gameTimeUTC.toString().split("T")[0] !== formattedDate
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
  return NextResponse.json({ gameIds, shouldRefreshStats, areGamesFromDate });
}
