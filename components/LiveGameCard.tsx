import { VStack, Text, useColorModeValue } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Game } from '@/types';
import { useIsGameLive } from '@/hooks/useIsGameLive';

export type LiveGameCardProps = {
  game: Game
}

const useBg = () => useColorModeValue('white', 'gray.700');


export const LiveGameCard = ({ game } : LiveGameCardProps) => {
  const hasBoxscore = game.gameStatus > 1;  // no boxscore if game hasnt started
  const isLive = useIsGameLive(game.gameId);
  const bg = useColorModeValue('white', 'gray.700');
  const quarterColor = useColorModeValue(isLive? 'darkgreen' : 'black', isLive? 'lightgreen' : 'gray.400');

  return (
    <NextLink href={hasBoxscore ? `/boxscore/${game.gameId}` : '#'}>
      <VStack
        align={'start'}
        spacing={2}
        w={'125px'}
        px={4}
        py={2}
        bg={bg}
        rounded={'md'}
      >
        <Text fontSize={'sm'} color={quarterColor}>
          {game.gameStatusText}
        </Text>
        <VStack spacing={0} align={'start'}>
          <Text fontWeight={'semibold'} letterSpacing={'wider'}>
            {game.homeTeam.teamTricode} - {game.homeTeam.score}
          </Text>
          <Text fontWeight={'semibold'} letterSpacing={'wider'}>
            {game.awayTeam.teamTricode} - {game.awayTeam.score}
          </Text>
        </VStack>
      </VStack>
    </NextLink>
  )
}