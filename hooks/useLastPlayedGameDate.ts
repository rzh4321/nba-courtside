import { useSchedule } from "./useSchedule";
import { LeagueScheduleResponse } from "@/types";
import { parse } from "date-fns";

function getHasPlayedGames(
  gameDate: LeagueScheduleResponse["leagueSchedule"]["gameDates"][number],
) {
  // returns true if at least one game in this game date is either still playing or has finished
  return gameDate.games.some((game) => game.gameStatus > 1);
}

export function getDateFromGameDate(
  gameDate: LeagueScheduleResponse["leagueSchedule"]["gameDates"][number],
) {
  return parse(gameDate.gameDate, "MM/dd/yyyy 00:00:00", new Date());
}

export function useLastPlayedGameDate() {
  const { data } = useSchedule();
  const gameDates = data?.leagueSchedule.gameDates;
  if (!gameDates) {
    return null;
  }
  // gameDates is a large array of objects, each object has gameDate and games array
  // traverse backwards to get most recent game date object
  for (let i = gameDates.length - 1; i >= 0; i--) {
    const gameDate = gameDates[i];
    if (gameDate && getHasPlayedGames(gameDate)) {
      return gameDate;
    }
  }

  return null;
}
