
import useSWR from 'swr'

export function useSchedule() {
  const result = useSWR('/api/schedule', async () => {
    const res = await fetch('/api/schedule');
    return await res.json();
  });
  
  return {
    ...result
  }
}