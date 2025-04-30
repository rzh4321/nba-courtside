"use client";
import useUserBets from "@/hooks/useUserBets";
import { UserBetWithGameInfo } from "@/types";
import Image from "next/image";
import { teamIds } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import BetCardBoxscore from "@/components/BetCardBoxscore";
import useSWR from "swr";

export default function Page() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { loading, activeBets, error } = useUserBets();
  const router = useRouter();
  if (!authLoading && !isAuthenticated) router.push("/");
  console.log(activeBets);

  const betDivs = activeBets.map((bet) => <BetCard key={bet.id} bet={bet} />);
  const loadingSkeleton = Array.from({ length: 3 }).map((num, i) => (
    <div
      key={i}
      className="w-full h-[90px] animate-pulse bg-white dark:bg-gray-700 rounded-md"
    ></div>
  ));

  return (
    <div className="flex flex-col gap-5">
      {loading ? loadingSkeleton : error ? "error" : betDivs}
    </div>
  );
}

type Props = {
  bet: UserBetWithGameInfo;
};
function BetCard({ bet }: Props) {
  const gameText = (
    <span className="dark:text-blue-500 font-thin tracking-wide text-sm">{`${bet.awayTeam} @ ${bet.homeTeam}`}</span>
  );

  const { data: boxscore, isLoading } = useSWR(
    `/api/boxscore/${bet.gameId}`,
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

  const displayBetType = (bet: UserBetWithGameInfo) => {
    const type = bet.betType;
    const home = bet.homeTeam;
    const away = bet.awayTeam;
    if (type.includes("SPREAD")) {
      const bettingLine = bet.bettingLine.startsWith("-")
        ? bet.bettingLine
        : `+${bet.bettingLine}`;
      return (type.includes("HOME") ? home : away) + " " + bettingLine;
    } else if (type.includes("MONEYLINE")) {
      return (type.includes("HOME") ? home : away) + " Moneyline";
    }
    return "";
  };

  const betTypeToString: Record<string, string> = {
    SPREAD_HOME: "SPREAD BETTING",
    SPREAD_AWAY: "SPREAD BETTING",
    OVER: "TOTAL POINTS",
    UNDER: "TOTAL POINTS",
    MONEYLINE_HOME: "MONEYLINE",
    MONEYLINE_AWAY: "MONEYLINE",
  };

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

  function getBetPlacedTimestamp(
    dateStr: string,
    displayTime: boolean,
  ): string {
    const dateUTC = new Date(dateStr);
    const localDate = new Date(dateUTC.toLocaleString()); // Convert to local time

    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const timeFormatter = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZoneName: "short",
    });

    if (isSameDay(localDate, now)) {
      return displayTime ? `Today ${timeFormatter.format(localDate)}` : "Today";
    }

    if (isSameDay(localDate, tomorrow)) {
      return displayTime
        ? `Tomorrow ${timeFormatter.format(localDate)}`
        : "Tomorrow";
    }

    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

    return displayTime
      ? `${dateFormatter.format(localDate)} ${timeFormatter.format(localDate)}`
      : dateFormatter.format(localDate);
  }
  type TeamName = keyof typeof teamIds;
  return (
    <div
      key={bet.id}
      className="flex flex-col gap-10 border-[1px] p-3 rounded bg-slate-800/50"
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex gap-1 items-center">
            <Image
              src={`https://cdn.nba.com/logos/nba/${bet.betType.includes("HOME") ? teamIds[bet.homeTeam as TeamName] : teamIds[bet.awayTeam as TeamName]}/primary/L/logo.svg`}
              width={30}
              height={30}
              alt={"team logo"}
              className="hidden sm:block w-[40px]"
            />
            <div className="flex flex-col gap-0">
              <span className="text-blue-500 font-semibold">
                {displayBetType(bet)}
              </span>
              <span className="text-[11px] dark:text-gray-400 text-gray-500 tracking-wide">
                {betTypeToString[bet.betType]}
              </span>
            </div>
          </div>
          <span>
            {!bet.odds.startsWith("-") && "+"}
            {bet.odds.replace(/\.?0+$/, "")}
          </span>
        </div>
        <div className="flex w-full">
          <div className="w-[90%]">
            {isLoading ? (
              <div className="w-full h-[60px] animate-pulse bg-white dark:bg-gray-700 rounded-md"></div>
            ) : boxscore ? (
              <BetCardBoxscore game={boxscore} />
            ) : (
              gameText
            )}
          </div>
          <div className="w-[10%] flex flex-col items-center justify-center font-light text-sm text-gray-400">
            {boxscore ? (
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
            <span className="dark:text-blue-500 font-light text-sm">
              Box Score <span className="ml-2">{">"}</span>
            </span>
          ) : (
            ""
          )}
        </div>
        <div className="flex flex-col gap-1 dark:bg-gray-700 p-3 -mx-[0.75rem] border-y-[1px] dark:border-gray-600">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm">${bet.amountPlaced}</span>
              <span className="text-[11px] dark:text-gray-400 text-gray-500 tracking-wide">
                TOTAL WAGER
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-end text-sm">${bet.totalPayout}</span>
              <span className="text-[11px] dark:text-gray-400 text-gray-500 tracking-wide">
                TOTAL PAYOUT
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            disabled
            className="rounded font-bold h-12 tracking-wide dark:bg-green-600 dark:border-green-700 dark:hover:bg-green-700 bg-green-400 border-green-500 hover:bg-green-500"
          >
            Cash out unavailable
          </Button>
        </div>
      </div>
    </div>
  );
}
