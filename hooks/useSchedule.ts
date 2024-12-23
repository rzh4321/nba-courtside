import useSWR from "swr";
import type { ScheduleGame } from "@/types";

export function useSchedule(date: string) {
  const todaysDate = new Date().toLocaleDateString("en-CA");
  const isToday = todaysDate === date;
  const { data, error, isValidating } = useSWR(
    `${isToday ? "/api/schedule/today" : `/api/schedule/${date}`}`,
    async (url: string) => {
      const res = await fetch(url, { cache: "no-store" });
      const data: ScheduleGame[] = await res.json();
      return data;
    },
    {
      refreshInterval: isToday ? 30000 : 0,
      revalidateOnFocus: isToday,
      revalidateOnReconnect: isToday,
      revalidateIfStale: isToday,
    },
  );

  if (error) console.log(error);
  return { data, error, isLoading: isValidating };
}
