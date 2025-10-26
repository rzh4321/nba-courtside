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
  
  function formatDollarAmount(dollars: string) {
    return Number(dollars).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <div>
      {/* straight bet placed div */}
      <div className="flex relative items-center gap-[6px] dark:bg-green-700 bg-green-600 text-white p-3 rounded-t-md">
        <CircleCheck />
        <span className="font-semibold">Straight bet placed!</span>
      </div>
      {/* team name, bet type, odds, live, teams */}
      <div className="flex justify-between dark:bg-gray-800 p-3">
        <div className="flex flex-col gap-1">
          <div className="flex flex-col">
            <span className="font-semibold tracking-tight text-[17px]">
              {betTypeToString[type].title}
            </span>
            <span className="text-sm dark:text-gray-400 text-gray-500 tracking-[1.2px] font-[350] font-skinny">
              {betTypeToString[type].desc}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="p-[2px] tracking-wider text-[11px] rounded-sm bg-red-900 text-white">
              LIVE
            </span>
            <div className="text-xs dark:text-gray-300 text-gray-500 tracking-tight">
              {teams.away}{" "}
              <span className="text-[9px] relative bottom-[1.2px]">@</span>{" "}
              {teams.home}
            </div>
          </div>
        </div>
        <div className="font-semibold tracking-[0.2px] text-[17px]">
          {odds > 0 && "+"}
          {odds!.toString()}
        </div>
      </div>
      {/* rows for wager, odds, to win, total payout */}
      <div className="px-3 dark:bg-slate-900">
        <div className="flex justify-between py-4 text-[17px]">
          <span className="font-[500]">Wager</span>
          <span className="tracking-[0.2px]">
            ${formatDollarAmount(wager)}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between py-4 text-[17px]">
          <span className="font-[500]">Odds</span>
          <span className="tracking-[0.2px]">
            {odds > 0 && "+"}
            {odds.toString()}
          </span>
        </div>
        <Separator />

        <div className="flex justify-between py-4 text-[17px]">
          <span className="font-[500]">To win</span>
          <span className="tracking-[0.2px]">
            ${formatDollarAmount((+payout - +wager).toString())}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between py-4 text-[17px]">
          <span className="font-[500]">Total payout</span>
          <span className="tracking-[0.2px]">
            ${formatDollarAmount(payout!)}
          </span>
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
