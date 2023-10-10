'use client'

import type { IBoxscore } from '@/types';
import { Container, Box, VStack } from '@chakra-ui/react';
import { BoxscoreTable } from '@/components/BoxscoreTable';
import { BoxscoreScore } from '@/components/BoxscoreScore';
import { useState, useEffect } from 'react';
import parse from 'date-fns/parse';
import useSWR from 'swr';

// https://cdn.nba.com/headshots/nba/latest/1040x760/${player.personId}.png

const Page = ({ params } : { params: {gameId: string}}) => {
    // const [boxscore, setBoxscore] = useState<IBoxscore>();
    const { data : boxscore } = useSWR(`/api/boxscore/${params.gameId}`, async () => {
      const res = await fetch(`/api/boxscore/${params.gameId}`);
      return await res.json();
    },
    {
      refreshInterval: 1000 * 30
    })

    useEffect(() => {
      if (boxscore) {
        const { homeTeam, awayTeam } = boxscore.game
        document.title = `${homeTeam.teamTricode} (${homeTeam.score}) vs ${awayTeam.teamTricode} (${awayTeam.score})`
      }
    }, [boxscore])
  
    

  const hTeamBoxscore = boxscore?.game?.homeTeam?.players;
  const vTeamBoxscore = boxscore?.game?.awayTeam?.players;

  return (
    <Container maxW={'container.xl'} paddingY={[8, 16]} centerContent>
      {boxscore? <VStack spacing={8}>
      <BoxscoreScore boxscore={boxscore} />
        <VStack spacing={4}>
          <BoxscoreTable playerStats={hTeamBoxscore || []} />
          <BoxscoreTable playerStats={vTeamBoxscore || []} />
        </VStack>
      </VStack> : null}
    </Container>
  )
}

export default Page;