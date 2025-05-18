"use client";

import Link from "next/link";
import type { ParsedGames } from "@/utils/mappers";
import { GAME_STATUS } from "@/constants";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { bettingService } from "@/bettingService";
import { fullNbaTeams } from "@/utils/getTeamNames";

export type LiveGameCardProps = {
  game: ParsedGames[0];
  gameDate: string;
};

function convertISODurationToMMSS(duration: string): string {
  const trimmedDuration = duration.trim();
  if (trimmedDuration === "") return "";

  if (/^[0-9]{1,2}:[0-9]{2}$/.test(trimmedDuration)) {
    return trimmedDuration;
  }

  const matches = trimmedDuration.match(/PT(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);

  if (!matches) {
    console.log(trimmedDuration);
    throw new Error("Invalid duration format");
  }

  const minutes = parseInt(matches[1] || "0");
  const seconds = matches[2] ? Math.round(parseFloat(matches[2])) : 0;
  const paddedSeconds = seconds.toString().padStart(2, "0");

  return `${minutes}:${paddedSeconds}`;
}

const LiveGameCard = ({ game, gameDate }: LiveGameCardProps) => {
  const searchParams = useSearchParams();
  const scheduleBarDate = searchParams.get("date");
  const isLive = game.gameStatus === GAME_STATUS.IN_PROGRESS;

  useEffect(() => {
    if (game.gameId && gameDate) {
      console.log("SETTING GAME ID IN DB...");
      const homeTeam = fullNbaTeams[game.homeTeam.teamName];
      const awayTeam = fullNbaTeams[game.awayTeam.teamName];
      bettingService
        .setGameId(homeTeam, awayTeam, gameDate, game.gameId)
        .catch((error) => console.error("Error setting game ID:", error));
    }
  }, [game.gameId, gameDate, game.awayTeam.teamName, game.homeTeam.teamName]);

  const getGameStatusText = () => {
    if (
      game.gameStatus === 2 &&
      game.gameStatusText.trim() !== "Halftime" &&
      !game.gameStatusText.trim().includes("OT") &&
      !game.gameStatusText.trim().includes("vertime")
    ) {
      if (
        convertISODurationToMMSS(game.gameClock) === "0:00" ||
        !game.gameClock.trim()
      ) {
        return game.period === 2 ? "Halftime" : `End Q${game.period}`;
      }
      return `Q${game.period} ${convertISODurationToMMSS(game.gameClock)}`;
    }

    return game.gameStatusText;
  };

  return (
    <Link
      href={`/boxscore/${game.gameId}${scheduleBarDate ? "?date=" + scheduleBarDate : ""}`}
    >
      {/* Desktop version */}
      <div className="hidden sm:block">
        <div className="flex flex-col items-start gap-2 w-[135px] h-[100px] px-4 py-2 bg-white dark:bg-gray-700 rounded-md">
          <p
            className={`text-md ${
              isLive
                ? "text-green-800 dark:text-green-300"
                : "text-black dark:text-gray-400"
            } ${
              game.gameStatus === GAME_STATUS.ENDED
                ? "font-bold"
                : "font-semibold"
            }`}
          >
            {getGameStatusText()}
          </p>
          <div className="flex flex-col items-start gap-0">
            <p
              className={`font-semibold tracking-wider ${
                game.awayTeam.score > game.homeTeam.score
                  ? "text-lg"
                  : "text-md"
              }`}
            >
              {game.awayTeam.teamTricode} - {game.awayTeam.score}
            </p>
            <p
              className={`font-semibold tracking-wider ${
                game.homeTeam.score > game.awayTeam.score
                  ? "text-lg"
                  : "text-md"
              }`}
            >
              {game.homeTeam.teamTricode} - {game.homeTeam.score}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile version */}
      <div className="sm:hidden">
        <div className="flex flex-col items-start gap-2 w-[120px] h-[95px] px-4 py-2 bg-white dark:bg-gray-700 rounded-md">
          <p
            className={`text-md ${
              isLive
                ? "text-green-800 dark:text-green-300"
                : "text-black dark:text-gray-400"
            } ${
              game.gameStatus === GAME_STATUS.ENDED
                ? "font-bold"
                : "font-semibold"
            }`}
          >
            {getGameStatusText()}
          </p>
          <div className="flex flex-col items-start gap-0">
            <p
              className={`font-semibold tracking-wide ${
                game.homeTeam.score > game.awayTeam.score
                  ? "text-md"
                  : "text-sm"
              }`}
            >
              {game.homeTeam.teamTricode} - {game.homeTeam.score}
            </p>
            <p
              className={`font-semibold tracking-wide ${
                game.awayTeam.score > game.homeTeam.score
                  ? "text-md"
                  : "text-sm"
              }`}
            >
              {game.awayTeam.teamTricode} - {game.awayTeam.score}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LiveGameCard;
