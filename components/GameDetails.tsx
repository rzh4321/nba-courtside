"use client";

import { useEffect } from "react";
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
import OddsSection from "./OddsSection";

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

  // update document title
  useEffect(() => {
    if (boxscore) {
      const { homeTeam, awayTeam } = boxscore;
      document.title = `${awayTeam.teamTricode} (${awayTeam.score}) vs ${homeTeam.teamTricode} (${homeTeam.score})`;
    }
  }, [boxscore]);

  return (
    <div className="flex flex-col gap-[50px] p-1x">
      <div>
        <div 
          className="flex items-center mb-5 w-fit cursor-pointer"
          onClick={() => router.back()}
        >
          <Undo2 />
          <span className="ml-2">Go Back</span>
        </div>
        {
          boxscore ? (
            <div className="flex flex-col items-center gap-8">
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
            </div>
          ) : null
        
      }
      </div>
      {boxscore && <OddsSection boxscore={boxscore} gameId={gameId} />}
      {boxscore && <TeamStats boxscore={boxscore} />}
    </div>
  );
};