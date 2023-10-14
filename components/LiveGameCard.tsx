import { VStack, Text, useColorModeValue, Show } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Game } from '@/types';
import { useIsGameLive } from '@/hooks/useIsGameLive';

export type LiveGameCardProps = {
  game: Game
}

export const LiveGameCard = ({ game } : LiveGameCardProps) => {
  console.log('inside livegamecard')
  console.log('inside livegamecard, game is ', game.homeTeam.score, ' and ', game.awayTeam.score);
  const hasBoxscore = game.gameStatus > 1;  // no boxscore if game hasnt started
  const isLive = useIsGameLive(game.gameId);
  const bg = useColorModeValue('white', 'gray.700');
  const quarterColor = useColorModeValue(isLive? 'darkgreen' : 'black', isLive? 'lightgreen' : 'gray.400');

  return (
    <NextLink href={hasBoxscore ? `/boxscore/${game.gameId}` : '#'}>
      <Show above='sm' >
        <VStack
          align={'start'}
          spacing={2}
          w={'135px'}
          px={4}
          py={2}
          bg={bg}
          rounded={'md'}
        >
          <Text fontSize={'md'} color={quarterColor} fontWeight={game.gameStatus === 3? 'bold' : 'semibold'}>
            {game.gameStatusText}
          </Text>
          <VStack spacing={0} align={'start'}>
            <Text fontWeight={'semibold'} letterSpacing={'wider'} fontSize={game.homeTeam.score > game.awayTeam.score ? 'lg' : 'md'} >
              {game.homeTeam.teamTricode} - {game.homeTeam.score}
            </Text>
            <Text fontWeight={'semibold'} letterSpacing={'wider'} fontSize={game.awayTeam.score > game.homeTeam.score ? 'lg' : 'md'} >
              {game.awayTeam.teamTricode} - {game.awayTeam.score}
            </Text>
          </VStack>
        </VStack>
      </Show>
      <Show below='sm' >
        <VStack
          align={'start'}
          spacing={2}
          w={'120px'}
          px={4}
          py={2}
          bg={bg}
          rounded={'md'}
        >
          <Text fontSize={'md'} color={quarterColor} fontWeight={game.gameStatus === 3? 'bold' : 'semibold'}>
            {game.gameStatusText}
          </Text>
          <VStack spacing={0} align={'start'}>
            <Text fontWeight={'semibold'} letterSpacing={'wide'} fontSize={game.homeTeam.score > game.awayTeam.score ? 'md' : 'sm'} >
              {game.homeTeam.teamTricode} - {game.homeTeam.score}
            </Text>
            <Text fontWeight={'semibold'} letterSpacing={'wide'} fontSize={game.awayTeam.score > game.homeTeam.score ? 'md' : 'sm'} >
              {game.awayTeam.teamTricode} - {game.awayTeam.score}
            </Text>
          </VStack>
        </VStack>

      </Show>
    </NextLink>
  )
}