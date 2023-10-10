'use client'

import type { IBoxscore } from '@/types';
import { Container, Box, VStack } from '@chakra-ui/react';
import { Boxscore } from '@/components/Boxscore';
import { useState, useEffect } from 'react';

// https://cdn.nba.com/headshots/nba/latest/1040x760/${player.personId}.png

const Page = ({ params } : { gameId: string}) => {
    const [boxscore, setBoxscore] = useState<IBoxscore>();
    
    useEffect(() => {
        const getBoxscore = async () => {
            const res = await fetch(`/api/boxscore/${params.gameId}`);
            const data = await res.json();
            setBoxscore(data);
        }
        getBoxscore();

    }, [params.gameId])

  const hTeamBoxscore = boxscore?.game?.homeTeam?.players;
  const vTeamBoxscore = boxscore?.game?.awayTeam?.players;

  return (
    <Container padding={[8, 16]} centerContent>
      <VStack spacing={8}>
        <Boxscore playerStats={hTeamBoxscore || []} />
        <Boxscore playerStats={vTeamBoxscore || []} />
      </VStack>
    </Container>
  )
}

export default Page;