import { LeagueScheduleResponse } from "@/types";
import { parse } from "date-fns";
import useSWR from "swr";

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

function useFullSchedule() {
  const result = useSWR("/api/schedule/year", async (url) => {
    const res = await fetch(url);
    return await res.json();
  });

  return {
    ...result, // dont rename fetch result to 'data' since it has a property
    // named 'data', so just use spread operator instead
  };
}

export function useLastPlayedGameDate() {
  const { data, isLoading, error } = useFullSchedule();
  let date;
  if (!isLoading && data) {
    const gameDates = data?.leagueSchedule.gameDates;
    // gameDates is a large array of objects, each object has gameDate and games array
    // traverse backwards to get most recent game date object
    for (let i = gameDates.length - 1; i >= 0; i--) {
      const gameDate = gameDates[i];
      if (gameDate && getHasPlayedGames(gameDate)) {
        date = gameDate.gameDate.split(" ")[0].replace(/\//g, "-");
        break;
      }
    }
  }

  return { date, isLoading, error };
}
