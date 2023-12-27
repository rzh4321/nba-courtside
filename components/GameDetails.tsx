"use client";

import { useEffect } from "react";
import { Box, VStack } from "@chakra-ui/react";
import useSWR from "swr";
import { ScoreDetails } from "./ScoreDetails";
import { NoGameMessage } from "./NoGameMessage";
import { BoxscoreTable } from "./BoxscoreTable";

export const GameDetails = ({ gameId }: { gameId: string }) => {
  const { data: boxscore } = useSWR(
    gameId ? `/api/boxscore/${gameId}` : null,
    async () => {
      const res = await fetch(`/api/boxscore/${gameId}`);
      return await res.json();
    },
    {
      refreshInterval: 1000 * 30, // update boxscore data every 30 seconds,
      refreshWhenHidden: true,
      refreshWhenOffline: true
    },
  );

  // update document title
  useEffect(() => {
    if (boxscore) {
      const { homeTeam, awayTeam } = boxscore.game;
      document.title = `${homeTeam.teamTricode} (${homeTeam.score}) vs ${awayTeam.teamTricode} (${awayTeam.score})`;
    }
  }, [boxscore]);

  return (
    <Box h={"full"} p={8}>
      {gameId ? (
        boxscore ? (
          // VStack separating score, teamA boxscore, and teamB boxscore
          <VStack spacing={8}>
            <ScoreDetails boxscore={boxscore.game} />
            <BoxscoreTable
              gameId={boxscore.game.gameId}
              team={boxscore.game.homeTeam}
            />
            <BoxscoreTable
              gameId={boxscore.game.gameId}
              team={boxscore.game.awayTeam}
            />
          </VStack>
        ) : null
      ) : (
        <NoGameMessage />
      )}
    </Box>
  );
};
