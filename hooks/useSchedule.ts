import useSWR from "swr";
import { parseGames } from "@/utils/mappers";
import getDays from "@/utils/getDays";
import getScoreboards from "@/actions/getScoreboards";

export function useSchedule(date: string | null) {
  if (date) {
    // a specific date on the calendar was chosen
    const {data, error, isValidating} = useSWR(`/api/schedule/${date}`, async (url: string) => {
      // if calling api instead, call fetch with {cache: 'no-store'}
      const data = await getScoreboards(date);
      return data;
    },
    )
    if (error) console.log(error)
    return {data, error, isLoading: isValidating};
  } else {
    // no date, show todays games
    const {data, error, isValidating} = useSWR('/api/schedule/today', async (url: string) => {
      const data = await getScoreboards();
      // if using api instead of server action, call fetch with no extra params
      return data;
    },
    {
      refreshInterval: 15000,
    }
    );
    return {data, error, isLoading: isValidating};
  }
  
}
