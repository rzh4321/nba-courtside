import useSWR from 'swr'

export function useSchedule() {
  const result = useSWR('/api/schedule', async (path) => {
    const res = await fetch('/api/schedule');
    return await res.json();
  }
    
  )
  return {
    ...result
  }
}