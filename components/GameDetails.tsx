"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { ScoreDetails } from "./ScoreDetails";
import { BoxscoreTable } from "./BoxscoreTable";
import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import { GAME_STATUS } from "@/constants";
import GameSummary from "./GameSummary";
import TeamStats from "./TeamStats";
import OddsSection from "./OddsSection";
import Link from "next/link";
import { MessageCircleWarning } from "lucide-react";

export const GameDetails = ({ gameId }: { gameId: string }) => {
  const router = useRouter();
  const { data: boxscore } = useSWR(
    gameId ? `/api/boxscore/${gameId}` : null,
    async (url) => {
      const res = await fetch(url);
      return await res.json();
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
        {boxscore ? (
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
        ) : (
          <div className="flex flex-col sm:gap-1 gap-3">
            <span className="font-bold flex sm:gap-1 gap-2 text-xl items-center"><MessageCircleWarning className="sm:w-8 sm:h-8 h-[50px] w-[50px]" />Game details are not yet available for this game.</span>
            <span className="tracking-wide sm:tracking-normal">If this is an upcoming game, betting odds may be available on the <Link className="underline cursor-pointer font-semibold" href={'/'}>Home</Link> page under the Live Odds tab.</span>
          </div>
        )}
      </div>
      {boxscore && <OddsSection boxscore={boxscore} gameId={gameId} />}
      {boxscore && <TeamStats boxscore={boxscore} />}
    </div>
  );
};
