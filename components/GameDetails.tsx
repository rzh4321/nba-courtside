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
import { nbaTeams } from "@/utils/getTeamNames";

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
  const awayTeamName =
    boxscore?.awayTeam.teamCity! + " " + boxscore?.awayTeam.teamName;
  const homeTeamName =
    boxscore?.homeTeam.teamCity! + " " + boxscore?.homeTeam.teamName;
  const gameDate = boxscore?.gameTimeLocal.toString().split("T")[0];
  const { gameBettingInfo, loading, error, isConnected } = useGameBettingInfo(
    gameId,
    homeTeamName,
    awayTeamName,
    gameDate,
  );
  const getSpread = (
    homeSpread: number | null | undefined,
    type: "home" | "away",
  ) => {
    if (homeSpread === null || homeSpread === undefined) return "-";
    else if (type === "away") {
      let opposite = -1 * homeSpread;
      if (opposite > 0) return "+" + homeSpread.toString().slice(1);
    } else {
      if (homeSpread > 0) return "+" + homeSpread.toString();
      return homeSpread.toString();
    }
  };

  const getMoneyline = (moneyline: number | null | undefined) => {
    if (moneyline === null || moneyline === undefined) return "-";
    if (moneyline > 0) return "+" + moneyline.toString();
    return moneyline;
  };

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
        <span className="font-bold tracking-widest">ODDS</span>
        <div className="flex flex-col gap-2">
          {loading ? (
            <Loader className="animate-spin" />
          ) : error ? (
            <span>{error}. Try reloading the page or try again later.</span>
          ) : !gameBettingInfo ? (
            <div>No betting information available</div>
          ) : !isConnected ? (
            <div className="text-yellow-500">
              ⚠️ Real-time updates temporarily unavailable
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <div className="invisible">s</div>
                  <div className="tracking-tight leading-4">
                    <span className="text-sm">
                      {nbaTeams[gameBettingInfo?.awayTeam].city}
                    </span>
                    <br />
                    <span className="font-semibold">
                      {nbaTeams[gameBettingInfo?.awayTeam].name}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2 items-center">
                    <span className="tracking-tight text-gray-400">Spread</span>
                    <div className="flex w-[81px] h-[68px] flex-col  rounded-md border-2 p-2 items-center">
                      {gameBettingInfo.homeSpread === null ||
                      gameBettingInfo.homeSpreadOdds === null ? (
                        <span className="my-auto">-</span>
                      ) : (
                        <>
                          <span>
                            {getSpread(gameBettingInfo?.homeSpread, "away")}
                          </span>
                          <span>{gameBettingInfo?.awaySpreadOdds}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    <span className="tracking-tight text-gray-400">Total</span>
                    <div className="flex w-[81px] h-[68px] flex-col rounded-md border-2 p-2 items-center">
                      {gameBettingInfo?.overUnder === null ||
                      gameBettingInfo?.overOdds === null ? (
                        <span className="my-auto">-</span>
                      ) : (
                        <>
                          <span>
                            {gameBettingInfo?.overUnder && "O"}{" "}
                            {gameBettingInfo?.overUnder}
                          </span>
                          <span>{gameBettingInfo?.overOdds}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    <span className="tracking-tight text-gray-400">Money</span>
                    <div className="flex w-[81px] h-[68px] justify-center rounded-md border-2 p-2 items-center">
                      <span>
                        {getMoneyline(gameBettingInfo?.awayMoneyline)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <div className="tracking-tight leading-4">
                    <span className="text-sm">
                      {nbaTeams[gameBettingInfo?.homeTeam].city}
                    </span>
                    <br />
                    <span className="font-semibold">
                      {nbaTeams[gameBettingInfo?.homeTeam].name}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2 items-center">
                    <div className="flex w-[81px] h-[68px] flex-col  rounded-md border-2 p-2 items-center">
                      {gameBettingInfo.homeSpread === null ||
                      gameBettingInfo.homeSpreadOdds === null ? (
                        <span className="my-auto">-</span>
                      ) : (
                        <>
                          <span>
                            {getSpread(gameBettingInfo?.homeSpread, "home")}
                          </span>
                          <span>{gameBettingInfo?.homeSpreadOdds}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    <div className="flex w-[81px] h-[68px] flex-col rounded-md border-2 p-2 items-center">
                      {gameBettingInfo?.overUnder === null ||
                      gameBettingInfo?.overOdds === null ? (
                        <span className="my-auto">-</span>
                      ) : (
                        <>
                          <span>
                            {gameBettingInfo?.overUnder && "U"}{" "}
                            {gameBettingInfo?.overUnder}
                          </span>
                          <span>{gameBettingInfo?.overOdds}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-center">
                    <div className="flex w-[81px] h-[68px] justify-center rounded-md border-2 p-2 items-center">
                      <span>
                        {getMoneyline(gameBettingInfo?.homeMoneyline)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {boxscore && <TeamStats boxscore={boxscore} />}
    </Box>
  );
};
