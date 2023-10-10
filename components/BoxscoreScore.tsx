import { Stack, HStack, Text } from '@chakra-ui/react'
import type { FC } from 'react'
import type { IBoxscore } from '@/types';
import Image from 'next/image'

export type ScoreSummaryProps = {
  teamSummary: IBoxscore['game']['homeTeam']
  reverse?: boolean
}

const ScoreSummary = ({
  teamSummary,
  reverse = false
} : ScoreSummaryProps) => {
  return (
    <Stack
      spacing={2}
      direction={reverse ? 'row-reverse' : 'row'}
      align={'center'}
    >
      <Image
        src={`https://cdn.nba.com/logos/nba/${teamSummary.teamId}/primary/L/logo.svg`}
        width={65}
        height={65}
        alt={teamSummary.teamTricode}
      />
      <Text fontSize={'2xl'} fontWeight={'semibold'}>
        {teamSummary.statistics.points}
      </Text>
    </Stack>
  )
}

export interface BoxscoreScoreProps {
  boxscore: IBoxscore
}

export const BoxscoreScore: FC<BoxscoreScoreProps> = ({ boxscore }) => {
  return (
    <HStack spacing={16}>
      <ScoreSummary
        teamSummary={boxscore.game.homeTeam}
      />
      <ScoreSummary
        teamSummary={boxscore.game.awayTeam}
        reverse
      />
    </HStack>
  )
}