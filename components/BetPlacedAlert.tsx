import { CircleCheck } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { AlertDialogCancel } from "./ui/alert-dialog";

type Props = {
  betTypeToString: {
    SPREAD_HOME: {
      title: string;
      desc: string;
    };
    SPREAD_AWAY: {
      title: string;
      desc: string;
    };
    OVER: {
      title: string;
      desc: string;
    };
    UNDER: {
      title: string;
      desc: string;
    };
    MONEYLINE_HOME: {
      title: string;
      desc: string;
    };
    MONEYLINE_AWAY: {
      title: string;
      desc: string;
    };
  };
  type:
    | "SPREAD_HOME"
    | "SPREAD_AWAY"
    | "OVER"
    | "UNDER"
    | "MONEYLINE_HOME"
    | "MONEYLINE_AWAY";
  teams: { home: string; away: string };
  odds: number;
  wager: string;
  payout: string;
  setIsBetPlaced: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function BetPlacedAlert({
  betTypeToString,
  type,
  teams,
  odds,
  wager,
  payout,
  setIsBetPlaced,
}: Props) {
  function formatDollarAmount(amountString: string) {
    // If there's no decimal point, add .00
    if (!amountString.includes(".")) {
      return amountString + ".00";
    }

    // Split the string at the decimal point
    const [dollars, cents] = amountString.split(".");

    // Pad or truncate cents to exactly 2 digits
    const formattedCents =
      cents.length < 2
        ? cents.padEnd(2, "0") // Pad with zeros if less than 2 digits
        : cents.substring(0, 2); // Truncate if more than 2 digits

    return `${dollars}.${formattedCents}`;
  }

  return (
    <div>
      {/* straight bet placed div */}
      <div className="flex items-center gap-2 bg-green-700 p-3 rounded-t-md ">
        <CircleCheck />
        <span className=" font-semibold">Straight bet placed!</span>
      </div>
      {/* team name, bet type, odds, live, teams */}
      <div className="flex justify-between dark:bg-gray-800 p-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col">
            <span>{betTypeToString[type].title}</span>
            <span className="text-[11px] dark:text-gray-400 text-gray-500 tracking-wide">
              {betTypeToString[type].desc}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="p-[2px] tracking-wider text-[11px] rounded-sm bg-red-900 text-white">
              LIVE
            </span>
            <span className="text-[11px]">
              {teams.away} @ {teams.home}
            </span>
          </div>
        </div>
        <div className="font-semibold">
          {odds > 0 && "+"}
          {odds!.toString()}
        </div>
      </div>
      {/* rows for wager, odds, to win, total payout */}
      <div className="px-3 dark:bg-slate-900">
        <div className="flex justify-between py-3">
          <span className="font-semibold">Wager</span>
          <span>${formatDollarAmount(wager)}</span>
        </div>
        <Separator />
        <div className="flex justify-between py-3">
          <span className="font-semibold">Odds</span>
          <span>
            {odds > 0 && "+"}
            {odds.toString()}
          </span>
        </div>
        <Separator />

        <div className="flex justify-between py-3">
          <span className="font-semibold">To win</span>
          <span>${formatDollarAmount((+payout - +wager).toString())}</span>
        </div>
        <Separator />
        <div className="flex justify-between py-3">
          <span className="font-semibold">Total payout</span>
          <span>${formatDollarAmount(payout!.toString())}</span>
        </div>
      </div>
      {/* buttons */}
      <Separator />
      <div className="p-3 flex gap-2 items-center h-[70px]">
        <Button
          onClick={() => setIsBetPlaced(false)}
          className="flex-1 hover:bg-blue-500 hover:text-white h-full rounded-sm bg-transparent text-blue-500 border-2 border-blue-500"
        >
          Reuse selection
        </Button>
        <AlertDialogCancel asChild>
          <Button
            onClick={() => setIsBetPlaced(false)}
            className="flex-1 bg-blue-500 text-white h-full hover:bg-blue-600 hover:text-white rounded-sm mt-0"
          >
            Done
          </Button>
        </AlertDialogCancel>
      </div>
    </div>
  );
}
