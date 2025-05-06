import { Loader } from "lucide-react";
import useGameBettingInfo from "@/hooks/useGameBettingInfo";
import { Boxscore } from "@/types";
import { fullNbaTeams } from "@/utils/getTeamNames";
import React from "react";
import OddsRow from "./OddsRow";

type OddsSectionProps = {
  boxscore: Boxscore;
  gameId: string;
};

export default function OddsSection({ boxscore, gameId }: OddsSectionProps) {
  const awayTeamName = fullNbaTeams[boxscore?.awayTeam.teamName];
  const homeTeamName = fullNbaTeams[boxscore?.homeTeam.teamName];
  const gameDate = boxscore?.gameTimeLocal.toString().split("T")[0];
  const { gameBettingInfo, loading, error, isConnected } = useGameBettingInfo(
    gameId,
    homeTeamName,
    awayTeamName,
    gameDate,
  );

  return (
    <div>
      <span className="font-bold tracking-widest">
        {gameBettingInfo?.hasEnded ? "OPENING" : "LIVE"} ODDS
      </span>
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="animate-pulse w-1/4 mt-2 h-[50px] bg-white dark:bg-gray-700 rounded-md"></div>
        ) : !gameBettingInfo && error ? (
          <span>
            Try reloading the page or try again later. If the issue persists,
            betting information may not be available for this game.
          </span>
        ) : !gameBettingInfo ? (
          <div>No betting information available</div>
        ) : (
          <>
            {!isConnected && (
              <div className="text-yellow-500">
                ⚠️ Real-time updates temporarily unavailable
              </div>
            )}
            <div className="flex justify-between items-center">
              <OddsRow
                gameBettingInfo={gameBettingInfo}
                isAwayTeam={true}
                gameId={gameId}
              />
            </div>
            <div className="flex justify-between items-center">
              <OddsRow
                gameBettingInfo={gameBettingInfo}
                isAwayTeam={false}
                gameId={gameId}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
