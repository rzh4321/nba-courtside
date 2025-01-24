"use client";

import { useEffect } from "react";
import { Box, HStack, VStack } from "@chakra-ui/react";
import useSWR from "swr";
import { ScoreDetails } from "./ScoreDetails";
import { NoGameMessage } from "./NoGameMessage";
import { BoxscoreTable } from "./BoxscoreTable";
import { useRouter } from "next/navigation";
import { Loader, Undo2 } from "lucide-react";
import getBoxScore from "@/actions/getBoxScore";
import { GAME_STATUS } from "@/constants";
import GameSummary from "./GameSummary";
import TeamStats from "./TeamStats";
import useGameBettingInfo from "@/hooks/useGameBettingInfo";

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
  const awayTeamName = boxscore?.awayTeam.teamCity! + ' ' + boxscore?.awayTeam.teamName;
  const homeTeamName = boxscore?.homeTeam.teamCity! + ' ' + boxscore?.homeTeam.teamName;

  const {gameBettingInfo, error, loading} = useGameBettingInfo('gameid', homeTeamName, awayTeamName);

  const getAwaySpread = (homeSpread: number | null | undefined) => {
    if (homeSpread === null || homeSpread === undefined) return '-';
    return -1 * homeSpread;
  }

  // update document title
  useEffect(() => {
    if (boxscore) {
      const { homeTeam, awayTeam } = boxscore;
      document.title = `${awayTeam.teamTricode} (${awayTeam.score}) vs ${homeTeam.teamTricode} (${homeTeam.score})`;
    }
  }, [boxscore]);

  return (
    <Box display={"flex"} p={1} flexDirection={"column"} gap={50}>
      <Box>
        <HStack
          cursor={"pointer"}
          marginBottom={5}
          width={"fit-content"}
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
                team={boxscore.awayTeam}
              />
              <BoxscoreTable
                isLive={boxscore.gameStatus !== GAME_STATUS.ENDED}
                team={boxscore.homeTeam}
              />
            </VStack>
          ) : null
        ) : (
          <NoGameMessage />
        )}
      </Box>
      <div>
        <span className='font-semibold tracking-widest'>ODDS</span>
        <div className="flex flex-col gap-2">
          {loading ? <Loader className="animate-spin" /> : 
          error ? <span>{error}</span> : 
          <div className="flex justify-between">
            
            <div className="flex flex-col gap-2">
              <div className="invisible">s</div>
              <div>{gameBettingInfo?.awayTeam}</div>
              </div>
            <div className="flex gap-2">
              <div className="w-[70px] flex flex-col gap-2 items-center">
                <span>Spread</span>
                <div className="flex flex-col self-stretch  rounded-md border-2 p-2 items-center">
                  <span>{getAwaySpread(gameBettingInfo?.homeSpread)}</span>
                  <span>{gameBettingInfo?.awaySpreadOdds}</span>
                </div>
              </div>
              <div className="w-[70px] flex flex-col gap-2 items-center">
              <span>Total</span>
                <div className="flex flex-col self-stretch rounded-md border-2 p-2 items-center">
                  <span>{gameBettingInfo?.overUnder && 'O'} {getAwaySpread(gameBettingInfo?.overUnder)}</span>
                  <span>{gameBettingInfo?.overOdds}</span>
                </div>
              </div>
              <div className="w-[70px] flex flex-col gap-2 items-center">
              <span>Money</span>
                <div className="flex justify-center self-stretch rounded-md border-2 p-2 items-center">
                  <span>{getAwaySpread(gameBettingInfo?.awayMoneyLine)}</span>
                </div>
              </div>
              
            </div>
          </div>
          
          }
        </div>
      </div>
      {boxscore && <TeamStats boxscore={boxscore} />}
    </Box>
  );
};
