import useSWR from 'swr'
import type { Game, LeagueScheduleResponse } from '@/types';
import { useMemo } from 'react'
import { useSchedule } from './useSchedule';

export function useGame(gameId: string) {
  const { data: schedule } = useSchedule()
  const game = useMemo(() => {
    const findGame = (game : Game) => game.gameId === gameId;
    // loop over all game dates in the schedule
    const gameDate = schedule?.leagueSchedule.gameDates.find((g : LeagueScheduleResponse['leagueSchedule']['gameDates'][0]) =>
    // loop over all games on this date to see if gameid is on this date
      g.games.find(findGame)
    )
    // returns an object info about the game
    return gameDate?.games.find(findGame)
  }, [schedule, gameId])
  return game
}