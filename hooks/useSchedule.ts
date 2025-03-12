import { useQuery } from '@tanstack/react-query';
import type { ScheduleGame } from "@/types";

export function useSchedule(date: string) {
  const todaysDate = new Date().toLocaleDateString("en-CA");
  const isToday = todaysDate === date;
  
  return useQuery<ScheduleGame[]>({
    queryKey: ['schedule', date], // Keep stable query key
    queryFn: async () => {
      // Only add cache busting parameter, don't change the query key
      const res = await fetch(`/api/schedule?date=${date === todaysDate ? 'today' : date}${isToday ? `&t=${Date.now()}` : ''}`);
      if (!res.ok) {
        throw new Error('Failed to fetch schedule');
      }
      return res.json();
    },    
    refetchInterval: isToday ? 10000 : false, // Refetch every 10 seconds for today's games
    refetchOnWindowFocus: isToday,
    staleTime: isToday ? 10000 : 60 * 60 * 1000, // 0 for today, 1 hour for historical
    gcTime: isToday ? 0 : 24 * 60 * 60 * 1000, // Short but non-zero for today
  });
}