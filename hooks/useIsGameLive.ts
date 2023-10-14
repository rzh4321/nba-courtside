import { useScoreboard } from "./useScoreboard";
import { LiveGame } from "@/types";
export function useIsGameLive(gameId: string) {
  const scoreboard = useScoreboard();
  const games = scoreboard.data?.scoreboard.games;
  // find the game from todays scoreboard
  const game = games?.find((g: LiveGame) => g.gameId === gameId);
  return game?.gameStatus === 2;
}
