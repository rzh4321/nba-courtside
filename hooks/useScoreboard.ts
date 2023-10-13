import useSWR from 'swr';

export function useScoreboard() {
  return useSWR(
    '/api/scoreboard',
    async () => {
        const res = await fetch('/api/scoreboard');
        return await res.json();
    },
    {
      refreshInterval: 1000 * 20
    }
  );
}