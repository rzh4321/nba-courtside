"use client";

import { useEffect } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import useSWR from "swr";
import { ScoreDetails } from "./ScoreDetails";
import { NoGameMessage } from "./NoGameMessage";
import { BoxscoreTable } from "./BoxscoreTable";
import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import getBoxScore from "@/actions/getBoxScore";
import { GAME_STATUS } from "@/constants";
import GameSummary from "./GameSummary";
import TeamStats from "./TeamStats";

export const GameDetails = ({ gameId }: { gameId: string }) => {
  const router = useRouter();
  const { data: boxscore } = useSWR(
    gameId ? `/api/boxscore/${gameId}` : null,
    async (url) => {
      return await getBoxScore(gameId);
    },
    {
      refreshInterval: 1000 * 30, // update boxscore data every 30 seconds,
      refreshWhenHidden: true,
      refreshWhenOffline: true,
    },
  );

  console.log("boxscore is ", boxscore);

  // update document title
  useEffect(() => {
    if (boxscore) {
      const { homeTeam, awayTeam } = boxscore;
      document.title = `${awayTeam.teamTricode} (${awayTeam.score}) vs ${homeTeam.teamTricode} (${homeTeam.score})`;
    }
  }, [boxscore]);

  return (
    <Box display={"flex"} p={8} flexDirection={"column"} gap={50}>
      <Box>
        <HStack
          cursor={"pointer"}
          marginBottom={5}
          width={'fit-content'}
          onClick={() => router.back()}
        >
          <Undo2 />
          <span>Go Back</span>
        </HStack>
        {gameId ? (
          boxscore ? (
            // VStack separating score, teamA boxscore, and teamB boxscore
            <VStack spacing={8}>
              <ScoreDetails boxscore={boxscore} />
              <GameSummary game={boxscore} />
              <BoxscoreTable
                isLive={boxscore.gameStatus !== GAME_STATUS.ENDED}
                team={boxscore.homeTeam}
              />
              <BoxscoreTable
                isLive={boxscore.gameStatus !== GAME_STATUS.ENDED}
                team={boxscore.awayTeam}
              />
            </VStack>
          ) : null
        ) : (
          <NoGameMessage />
        )}
      </Box>

      {boxscore && <TeamStats boxscore={boxscore} />}
    </Box>
  );
};
