import type { BoxscoreResponse } from "@/types";
import {
  Box,
  Text,
  Flex,
  VStack,
  HStack,
  Badge,
  useColorModeValue
} from '@chakra-ui/react'
import Image from 'next/image'

type TeamDetailsProps = {
  team: BoxscoreResponse['game']['homeTeam']
  reverse?: boolean
}

const TeamDetails = ({ team, reverse = false } : TeamDetailsProps) => {
  return (
    <Flex
      direction={reverse ? 'row-reverse' : 'row'}
      gap={2}
      alignItems={'center'}
    >
      <Image
        src={`https://cdn.nba.com/logos/nba/${team.teamId}/primary/L/logo.svg`}
        width={75}
        height={75}
        alt={team.teamName}
      />
      {/* display the tricode and score */}
      <Box textAlign={reverse ? 'right' : 'left'}>
        <Text fontSize={'lg'} fontWeight={'bold'}>
          {team.teamTricode}
        </Text>
        <Text fontSize={'3xl'} fontWeight={'bold'} mt={-2}>
          {team.score}
        </Text>
      </Box>
    </Flex>
  )
}

export type ScoreDetailsProps = {
  boxscore: BoxscoreResponse['game']
}

export const ScoreDetails = ({ boxscore } : ScoreDetailsProps) => {
  const isLive = boxscore.gameStatus === 2;

  const bg = useColorModeValue('white', 'gray.600');

  return (
    <Box p={4} bg={bg} rounded={'lg'} shadow={'lg'} w={'full'} maxW={'480px'}>
      <HStack
        display={['flex', 'none']}
        align={'center'}
        justify={'center'}
        mb={4}
      >
        {isLive && <Badge colorScheme={'red'}>LIVE</Badge>}
        <Text display={'inline-block'}>{boxscore.gameStatusText}</Text>
      </HStack>
      <Flex dir={'row'} justify={'space-between'} alignItems={'center'}>
        <TeamDetails team={boxscore.homeTeam} />
        <VStack spacing={1} display={['none', 'flex']}>
          <Text>{boxscore.gameStatusText}</Text>
          {isLive && <Badge colorScheme={'red'}>LIVE</Badge>}
        </VStack>
        <TeamDetails team={boxscore.awayTeam} reverse />
      </Flex>
    </Box>
  )
}