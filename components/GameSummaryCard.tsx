import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Flex,
  Stack,
  useColorMode
} from '@chakra-ui/react'
import type { ScoreboardResponse } from '@/types';
import Image from 'next/image'
import Link from 'next/link'

type TeamDetailsProps = {
  team: ScoreboardResponse['scoreboard']['games'][0]['homeTeam']
  reverse?: boolean
}

const TeamDetails = ({ team, reverse = false } : TeamDetailsProps) => {
  const { colorMode } = useColorMode()

  return (
    <Stack
      spacing={2}
      direction={reverse ? 'row-reverse' : 'row'}
      align={'center'}
    >
      <Image
        src={`https://cdn.nba.com/logos/nba/${team.teamId}/primary/L/logo.svg`}
        width={50}
        height={50}
        alt={team.teamTricode}
      />
      <VStack spacing={0} align={'flex-start'}>
        <Text fontWeight={'semibold'}>{team.teamTricode}</Text>
        <Text
          fontSize={12}
          color={colorMode === 'light' ? 'gray.600' : 'gray.400'}
        >
          ({team.wins}-{team.losses})
        </Text>
      </VStack>
    </Stack>
  )
}

export type GameSummaryCardProps = {
  game: ScoreboardResponse['scoreboard']['games'][0]
}

export const GameSummaryCard = ({ game } : GameSummaryCardProps) => {
  const { colorMode } = useColorMode()

  return (
    <Box
      width={['full', 400]}
      borderRadius={'md'}
      bg={colorMode === 'light' ? 'gray.300' : 'gray.700'}
    >
      <VStack spacing={4} padding={4}>
        <Text align={'center'}>{game.gameTimeUTC}</Text>
        <Flex justifyContent={'space-between'} width={'full'}>
          <TeamDetails team={game.homeTeam} />
          <TeamDetails team={game.awayTeam} reverse />
        </Flex>
      </VStack>
      <Box
        borderBottomRadius={'md'}
        bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
        border={'2px'}
        borderColor={colorMode === 'light' ? 'gray.300' : 'gray.700'}
        padding={2}
      >
        <HStack spacing={4}>
          <Link
            href={`/boxscore/${game.gameId}`}
            passHref
          >
            <Button
              as={'a'}
              size={'sm'}
              variant={'solid'}
              colorScheme={'purple'}
            >
              Boxscore
            </Button>
          </Link>
          <Button size={'sm'} variant={'outline'} colorScheme={'purple'}>
            Watch
          </Button>
        </HStack>
      </Box>
    </Box>
  )
}