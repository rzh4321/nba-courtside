import { Button } from "@/components/ui/button";
import BetCardBoxscore from "@/components/BetCardBoxscore";
import { UserBetWithGameInfo } from "@/types";
import Image from "next/image";
import { teamIds } from "@/constants";

type Props = {
  bet: UserBetWithGameInfo;
};
export default function BetCard({ bet }: Props) {
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

  function getBetPlacedTimestamp(dateStr: string): string {
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
      return `TODAY ${timeFormatter.format(localDate)}`;
    }

    if (isSameDay(localDate, tomorrow)) {
      return `TOMORROW ${timeFormatter.format(localDate)}`;
    }

    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

    return `${dateFormatter.format(localDate)} ${timeFormatter.format(localDate)}`;
  }
  type TeamName = keyof typeof teamIds;
  return (
    <div
      key={bet.id}
      className="flex flex-col gap-10 border-[1px] p-3 rounded bg-slate-50 dark:bg-slate-800/50"
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
        <BetCardBoxscore bet={bet} />

        <div className="flex flex-col gap-2 px-3 dark:bg-gray-700 p-2 -mx-[0.75rem] border-y-[1px] dark:border-gray-500">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-sm">${bet.amountPlaced}</span>
              <span className="text-[11px] dark:text-gray-400 text-gray-500 tracking-wide">
                TOTAL WAGER
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-end text-sm">
                $
                {bet.status === "PENDING" || bet.status === "WON"
                  ? bet.totalPayout
                  : "0.00"}
              </span>
              <span className="text-[11px] dark:text-gray-400 text-gray-500 tracking-wide">
                {bet.status === "PENDING" ? "TOTAL PAYOUT" : "RETURNED"}
              </span>
            </div>
          </div>
          {bet.status === "PENDING" && (
            <Button
              variant="outline"
              disabled
              className="rounded font-bold h-12 tracking-wide dark:bg-green-600 dark:border-green-700 dark:hover:bg-green-700 bg-green-400 border-green-500 hover:bg-green-500"
            >
              Cash out unavailable
            </Button>
          )}
          <div className="flex justify-between items-center border-t-2 pt-2 dark:border-gray-500 text-[12px] dark:text-gray-400 text-gray-500 tracking-wide">
            <span>{`BET ID: ${bet.id}`}</span>
            <span>{`PLACED: ${getBetPlacedTimestamp(bet.placedAt)}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
