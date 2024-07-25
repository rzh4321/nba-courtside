import useSWR from "swr";
import { parseGames } from "@/utils/mappers";
import getDays from "@/utils/getDays";
import { API, DATE_TITLE_FORMAT } from "@/constants";


export function useSchedule(date: string | null) {
  if (date) {
    const {data, error, isValidating} = useSWR(`${API.BASE_URL}/scoreboardv3&GameDate=${date}&LeagueID=00`, async (url: string) => {
      console.log('URL IS ', url);
      const res = await fetch(url, {cache: 'no-store'});
      const data = await res.json();
      return data;
    },
    )
    return {data: parseGames(data), error, isLoading: isValidating};
  } else {
    const {data, error, isValidating} = useSWR(`${API.DETAILS_URL}/scoreboard/todaysScoreboard_00.json`, async (url: string) => {
      console.log('URL IS ', url);
      const res = await fetch(url);
      const data = await res.json();
      return data;
    },
    {
      refreshInterval: 15000,
    }
    )
    return {data: parseGames(data), error, isLoading: isValidating};
  }
  
}
