import { useQuery } from "@tanstack/react-query";
import type { ScheduleGame } from "@/types";
import { isYesterday, parse } from "date-fns";

export function useSchedule(date: string | null) {
  console.log("useSchedule date:", date);
  let wasYesterday = false;
  if (date) {
    const dateInUserTimezone = parse(date, "yyyy-MM-dd", new Date());
    wasYesterday = isYesterday(dateInUserTimezone);
    console.log("wasYesterday:", wasYesterday);
  }
  // if date is null, always use todays scoreboard API. Else use the specific date API
  const todaysDate = new Date().toLocaleDateString("en-CA");
  const isToday = todaysDate === date;

  return useQuery<ScheduleGame[]>({
    queryKey: ["schedule", date], // Keep stable query key
    queryFn: async () => {
      const res = await fetch(
        `/api/schedule?date=${!date || isToday ? "today" : date}&cache=${!isToday && !wasYesterday && date !== null}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch schedule");
      }
      return res.json();
    },
    refetchInterval: isToday || wasYesterday || !date ? 20000 : false, // Refetch every 20 seconds for today's games
    refetchOnWindowFocus: isToday || wasYesterday || !date,
    staleTime: isToday || wasYesterday || !date ? 10000 : 60 * 60 * 1000, // 10s for today, 1 hour for historical
    gcTime: isToday || wasYesterday || !date ? 0 : 24 * 60 * 60 * 1000, // can garbage collect immediately for todays scores
  });
}
