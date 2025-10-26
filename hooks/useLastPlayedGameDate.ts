import { useEffect, useMemo, useState } from "react";
import { LeagueScheduleResponse } from "@/types";
import { parse } from "date-fns";

function getHasPlayedGames(
  gameDate: LeagueScheduleResponse["leagueSchedule"]["gameDates"][number],
) {
  return gameDate.games.some((game) => game.gameStatus > 1);
}

export function getDateFromGameDate(
  gameDate: LeagueScheduleResponse["leagueSchedule"]["gameDates"][number],
) {
  return parse(gameDate.gameDate, "MM/dd/yyyy 00:00:00", new Date());
}

function useFullSchedule(needLiveData = true) {
  const [data, setData] = useState<LeagueScheduleResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetch("/api/schedule/year", {
          cache: needLiveData ? "no-store" : "force-cache",
        });
        const d = await result.json();
        setData(d);
      } catch (err) {
        setError(err);
      }
    };
    getData();
  }, [needLiveData]);

  useEffect(() => {
    if (data) setIsLoading(false);
  }, [data]);

  return {
    data,
    isLoading,
    error,
  };
}

export function useLastPlayedGameDate() {
  // get the full schedule JSON and parse out the last date that had games played
  const { data, isLoading: fullScheduleLoading, error } = useFullSchedule();
  const { date, dateLoading } = useMemo(() => {
    if (fullScheduleLoading || !data) {
      return { date: null, dateLoading: true };
    }
    // gameDates is a large array of objects, each object has gameDate and games array
    // traverse backwards to get most recent game date object
    const gameDates = data?.leagueSchedule.gameDates;
    for (let i = gameDates.length - 1; i >= 0; i--) {
      const gameDate = gameDates[i];
      if (gameDate && getHasPlayedGames(gameDate)) {
        const formatted = gameDate.gameDate.split(" ")[0].replace(/\//g, "-");
        return { date: formatted, dateLoading: false };
      }
    }

    return { date: null, dateLoading: false };
  }, [data, fullScheduleLoading]);

  return { date, dateLoading, error };
}
