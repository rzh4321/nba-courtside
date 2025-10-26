import { Boxscore } from "@/types";
import { memo } from "react";
import useSWR from "swr";
import Link from "next/link";
import type { UserBetWithGameInfo, Period } from "@/types";
import { GAME_STATUS } from "@/constants";

type Props = {
  bet: UserBetWithGameInfo;
};
function BetCardBoxscore({ bet }: Props) {
  const gameText = (
    <span className="dark:text-blue-500 font-thin tracking-wide text-sm">{`${bet.awayTeam} @ ${bet.homeTeam}`}</span>
  );

  const { data: boxscore, isLoading } = useSWR(
    `/api/boxscore/${bet.gameId}`,
    async (url) => {
      const res = await fetch(url, { cache: "no-cache" });
      return await res.json();
    },
    {
      refreshInterval: 1000 * 30, // update boxscore data every 30 seconds,
      refreshWhenHidden: true,
      refreshWhenOffline: true,
    },
  );
  const homeScoreLength = boxscore
    ? boxscore.homeTeam.score.toString().length
    : null;
  const awayScoreLength = boxscore
    ? boxscore.awayTeam.score.toString().length
    : null;

  function getGameDate(dateStr: string): string {
    const utcDate = new Date(dateStr);

    // Get UTC date components
    const utcYear = utcDate.getUTCFullYear();
    const utcMonth = utcDate.getUTCMonth(); // 0-based
    const utcDay = utcDate.getUTCDate();

    // Create a date object using only the UTC date parts (no time zone shift)
    const dateOnly = new Date(Date.UTC(utcYear, utcMonth, utcDay));

    // Get user's local "today" and "tomorrow"
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Compare local today/tomorrow with the UTC date (converted to local calendar day)
    const localDateFromUTC = new Date(
      utcDate.toISOString().split("T")[0] + "T00:00:00",
    ); // treat as local calendar day

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    if (isSameDay(localDateFromUTC, today)) {
      return "Today";
    }

    if (isSameDay(localDateFromUTC, tomorrow)) {
      return "Tomorrow";
    }

    // Return UTC date in M/D/YYYY format
    return `${utcMonth + 1}/${utcDay}/${utcYear}`;
  }

  return (
    <>
      <div className="flex w-full">
        <div className="w-full sm:w-[90%]">
          {isLoading ? (
            <div className="w-full h-[60px] animate-pulse bg-white dark:bg-gray-700 rounded-md"></div>
          ) : boxscore && boxscore.gameStatus !== GAME_STATUS.NOT_STARTED ? (
            <div className="rounded-lg px-3 flex text-sm justify-between">
              <div className="flex flex-col gap-3 justify-center">
                <span>{`${boxscore.awayTeam.teamCity} ${boxscore.awayTeam.teamName}`}</span>
                <span>{`${boxscore.homeTeam.teamCity} ${boxscore.homeTeam.teamName}`}</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-center self-end">
                  <div className="flex gap-2">
                    {boxscore.awayTeam.periods.map((period: Period) => (
                      <span key={period.period}>{period.score}</span>
                    ))}
                  </div>
                  <span className="font-bold text-base">
                    {homeScoreLength > awayScoreLength && (
                      <span className="invisible">1</span>
                    )}
                    {boxscore.awayTeam.score}
                  </span>
                </div>
                <div className="flex gap-3 items-center self-end">
                  <div className="flex gap-2 text-right">
                    {boxscore.homeTeam.periods.map((period: Period) => (
                      <span key={period.period}>{period.score}</span>
                    ))}
                  </div>
                  <span className="font-bold text-base">
                    {awayScoreLength > homeScoreLength && (
                      <span className="invisible">1</span>
                    )}
                    {boxscore.homeTeam.score}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            gameText
          )}
        </div>
        <div className="hidden w-[10%] sm:flex flex-col items-center justify-center font-light text-sm text-gray-800 dark:text-gray-400">
          {boxscore && boxscore.gameStatus === GAME_STATUS.IN_PROGRESS ? (
            <>
              {boxscore.gameStatus === 2 && (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  LIVE
                </span>
              )}
              <span>{boxscore.gameStatusText}</span>
            </>
          ) : (
            getGameDate(bet.gameDate)
          )}
        </div>
      </div>
      <div>
        {boxscore ? (
          <Link href={`${boxscore ? `/boxscore/${boxscore.gameId}` : "#"}`}>
            <span className="dark:text-blue-500 text-blue-800 font-light text-sm">
              Box Score <span className="ml-2">{">"}</span>
            </span>
          </Link>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default memo(BetCardBoxscore);
