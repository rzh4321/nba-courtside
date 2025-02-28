import Image from "next/image";
import type { Boxscore, Team } from "@/types";

type TeamDetailsProps = {
  team: Team;
  reverse?: boolean;
};

const TeamDetails = ({ team, reverse = false }: TeamDetailsProps) => {
  return (
    <div
      className={`flex gap-2 items-center ${
        reverse ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Image
        src={`https://cdn.nba.com/logos/nba/${team.teamId}/primary/L/logo.svg`}
        width={75}
        height={75}
        alt={team.teamName}
      />
      <div
        className={`hidden sm:block ${reverse ? "text-right" : "text-left"}`}
      >
        <p className="text-lg font-bold">{team.teamTricode}</p>
        <p className="-mt-2 text-3xl font-bold">{team.score}</p>
      </div>
      <div className={`sm:hidden -m-1 ${reverse ? "text-right" : "text-left"}`}>
        <p className="text-md font-bold">{team.teamTricode}</p>
        <p className="-mt-2 text-2xl font-bold">{team.score}</p>
      </div>
    </div>
  );
};

export type ScoreDetailsProps = {
  boxscore: Boxscore;
};

export const ScoreDetails = ({ boxscore }: ScoreDetailsProps) => {
  const isLive = boxscore.gameStatus === 2;

  return (
    <div className="w-full max-w-[480px] p-4 bg-white dark:bg-gray-600 rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <TeamDetails team={boxscore.awayTeam} />
        <div className="flex flex-col items-center gap-1">
          <p>{boxscore.gameStatusText}</p>
          {isLive && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              LIVE
            </span>
          )}
        </div>
        <TeamDetails team={boxscore.homeTeam} reverse />
      </div>
    </div>
  );
};
