import { useScoreboard } from "./useScoreboard";
import { Game } from "@/types";
export function useIsGameLive(gameId: string) {
  const scoreboard = useScoreboard();
  const games = scoreboard.data.scoreboard.games;
  const game = games.find((g : Game) => g.gameId === gameId);
  return game?.gameStatus === 2;
}