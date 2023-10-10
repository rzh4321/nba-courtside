'use client'

import { useEffect, useState } from 'react'
import { Container, VStack, Text } from '@chakra-ui/react';
// import { DayPicker } from '@/components/DayPicker';
import { GameSummaryCard } from '@/components/GameSummaryCard';
import { ScoreboardResponse } from '@/types';
import useSWR from 'swr';


const Home = () => {
  // const [selectedDate, setSelectedDate] = useState(new Date())
  // const [data, setData] = useState<ScoreboardResponse>();
  // useEffect(() => {
  //   const retrieveScoreboard = async() => {
  //       const res = await fetch('/api/scoreboard');
  //       const data = await res.json();
  //       console.log('SCOREBOARD: ', data);
  //       setData(data);
  //       return data;
  //   }
  //   retrieveScoreboard();
  // }, []);

  const { data } = useSWR('/api/scoreboard', async () => {
    const res = await fetch('/api/scoreboard');
    return await res.json();
  })

  return (
    <Container padding={[8, 16]} centerContent>
      <VStack spacing={[8, 16]} width={'full'}>
        
        <VStack spacing={[4, 8]} width={'full'}>
          {data?.scoreboard.games.map((game) => (
            <GameSummaryCard key={game.gameId} game={game} />
          ))}
          {data?.scoreboard.games.length === 0 && <Text>There are no games today</Text>}
        </VStack>
      </VStack>
    </Container>
  )
}

export default Home;