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
      // Don't show cached data while revalidating
      keepPreviousData: false,
      // Force revalidation on mount
      revalidateOnMount: true,
      // Clear cache when date changes
      dedupingInterval: 0,
    },
  );

  if (error) console.log(error);
  return {
    data: isValidating ? undefined : data,
    error,
    isLoading: isValidating,
  };
}
