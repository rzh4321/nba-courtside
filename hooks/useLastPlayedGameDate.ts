import { useSchedule } from './useSchedule'
import type { LeagueScheduleResponse } from '@/types';
import { getDate, parse } from 'date-fns'

function getHasPlayedGames(
  gameDate: LeagueScheduleResponse['leagueSchedule']['gameDates'][number]
) {
    // returns true if at least one game in this game date is either still playing or has finished
  return gameDate.games.some((game) => game.gameStatus > 1)
}

function getDateFromGameDate(
  gameDate: LeagueScheduleResponse['leagueSchedule']['gameDates'][number]
) {
  return parse(gameDate.gameDate, 'MM/dd/yyyy 00:00:00', new Date())
}

export function useLastPlayedGameDate() {
  const { data } = useSchedule()
  const gameDates = data?.leagueSchedule.gameDates

  if (!gameDates) {
    return null
  }

  // traverse backwards to get most recent game date (formatted)
  for (let i = gameDates.length - 1; i >= 0; i--) {
    const gameDate = gameDates[i];
    if (gameDate && getHasPlayedGames(gameDate)) {
      return getDateFromGameDate(gameDate)
    }
  }

  return null
}