import {
    Flex,
    VStack,
    Text,
    HStack,
    Container,
    Box,
    useColorModeValue,
  } from '@chakra-ui/react'
  import { format, parse } from 'date-fns'
  import NextLink from 'next/link'
  import { useScoreboard } from '@/hooks/useScoreboard';
  import { LiveGameCard } from './LiveGameCard';
  import { GameDetails } from './GameDetails';
  import { DayPicker } from './DayPicker';
  import { Game } from '@/types';
  import '@/global.css';
    
  export const ScheduleBar = () => {
    const { data, isLoading } = useScoreboard()
    const bg = useColorModeValue('gray.700', 'gray.900');

    return (
      <Box bg={bg} w={'full'} h={isLoading ? '157px' : 'auto'}>
        <Container maxW={'container.lg'}>
          <VStack w={'full'} align={'start'} p={4}>
            <Flex
              w={'full'}
              direction={['row']}
              justify={'space-between'}
              align={['flex-start', 'center']}
              gap={[2, 0]}
            >
              {data && (
                <Text color={'white'} fontWeight={'semibold'}>
                  Games for{' '}
                  {format(
                    parse(data.scoreboard.gameDate, 'yyyy-MM-dd', new Date()),
                    'EEEE, MMMM do'
                  )}
                </Text>
              )}
            <DayPicker />
            </Flex>
            <HStack w={'full'} className='scrollable' overflow={'auto'}>
              {isLoading ? (
                <Text>Loading</Text>
              ) : !data ? (
                <Text>There was an error</Text>
              ) : data.scoreboard.games.length > 0 ? (
                <HStack spacing={8}>
                  {data.scoreboard.games.map((game: Game) => (
                    <LiveGameCard key={game.gameId} game={game} />
                  ))}
                </HStack>
              ) : (
                <Flex w={'full'} color={'gray.500'} fontWeight={'semibold'}>
                  <Text>No games scheduled for today</Text>
                </Flex>
              )}
            </HStack>
          </VStack>
        </Container>
      </Box>
    )
  }