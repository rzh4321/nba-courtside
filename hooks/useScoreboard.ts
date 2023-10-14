import useSWR from "swr";

export function useScoreboard() {
  // call api (which also revalidates every 20s) every 20s to get updated scoreboard
  return useSWR(
    "/api/scoreboard",
    async () => {
      const res = await fetch("/api/scoreboard");
      return await res.json();
    },
    {
      refreshInterval: 1000 * 20,
    },
  );
}
