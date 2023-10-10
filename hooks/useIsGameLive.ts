import { useGame } from './useGame';

export function useIsGameLive(gameId: string) {
  const game = useGame(gameId)
  return game?.gameStatus === 2
}