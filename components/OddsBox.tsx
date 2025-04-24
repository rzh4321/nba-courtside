import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useState, useRef, useEffect } from "react";
import { API_URL } from "@/config";
import useAuth from "@/hooks/useAuth";
import BetPlacedAlert from "./BetPlacedAlert";
import { GAME_STATUS } from "@/constants";
import { bettingService } from "@/bettingService";
import DollarInput from "./DollarInput";
import { Loader } from "lucide-react";

const formSchema = z.object({
  wager: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Required",
  }),
});

type Props = {
  children: React.ReactElement;
  type:
    | "SPREAD_HOME"
    | "SPREAD_AWAY"
    | "OVER"
    | "UNDER"
    | "MONEYLINE_HOME"
    | "MONEYLINE_AWAY";
  odds: number | null;
  bettingLine?: number | undefined | null;
  gameId: string;
  teams: { home: string; away: string };
  gameEnded: boolean;
  gameDate: string;
};

export default function OddsBox({
  children,
  type,
  odds,
  bettingLine,
  gameId,
  teams,
  gameEnded,
  gameDate,
}: Props) {
  const [pending, setPending] = useState(false);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const [payout, setPayout] = useState<undefined | string>();
  const [prevWager, setPrevWager] = useState<undefined | string>();
  const [wager, setWager] = useState<undefined | string>();
  const {
    isAuthenticated,
    user,
    loading: authLoading,
    subtractBalance,
  } = useAuth();
  const token = localStorage.getItem("token");
  const betTypeToString = {
    SPREAD_HOME: {
      title: `${teams.home} ${bettingLine! > 0 ? "+" : ""}${bettingLine}`,
      desc: "SPREAD BETTING",
    },
    SPREAD_AWAY: {
      title: `${teams.away} ${bettingLine! > 0 ? "+" : ""}${bettingLine}`,
      desc: "SPREAD BETTING",
    },
    OVER: { title: `Over ${bettingLine}`, desc: "TOTAL POINTS" },
    UNDER: { title: `Under ${bettingLine}`, desc: "TOTAL POINTS" },
    MONEYLINE_HOME: { title: teams.home, desc: "MONEYLINE" },
    MONEYLINE_AWAY: { title: teams.away, desc: "MONEYLINE" },
  };

  const handleClickOdds = (e: React.MouseEvent<HTMLDivElement>) => {
    if (authLoading) return;

    if (!isAuthenticated) {
      document.getElementById("logInButton")?.click();
      e.stopPropagation();
      return;
    }
    if (
      odds === null ||
      (!type.includes("MONEYLINE") && bettingLine === null) ||
      (!type.includes("MONEYLINE") && bettingLine === undefined) ||
      gameEnded
    ) {
      e.stopPropagation();
      return;
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wager: prevWager,
    },
  });

  const checkGameEnded = async () => {
    let gameEnded = false;
    try {
      const res = await fetch(`/api/boxscore/${gameId}`);
      const data = await res.json();
      gameEnded = data.gameStatus === GAME_STATUS.ENDED;
      if (gameEnded) {
        const res = await bettingService.markGameEnded(gameId);
        console.log(res);
      }
    } catch (e) {
      // this game has no boxscore yet, so it hasn't even started. OK to place a bet
    }
    return gameEnded;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    const gameEnded = await checkGameEnded();
    if (gameEnded) {
      toast.error("This game has ended.");
    } else if (user && user.balance >= +values.wager) {
      console.log({
        gameId: gameId,
        betType: type,
        amountToPlace: +values.wager,
        odds: +odds!,
        homeTeam: teams.home,
        awayTeam: teams.away,
        gameDate: gameDate,
        ...(bettingLine !== undefined && { bettingLine }),
      });
      const response = await fetch(`${API_URL}/bets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameId: gameId,
          betType: type,
          amountToPlace: values.wager,
          odds: odds,
          homeTeam: teams.home,
          awayTeam: teams.away,
          gameDate: gameDate,
          ...(bettingLine !== undefined && { bettingLine }),
        }),
      });
      if (response.ok) {
        const res = await response.json();
        console.log(res);
        subtractBalance(+values.wager);
        setPrevWager(values.wager);
        setPayout(res.totalPayout);
        setIsBetPlaced(true);
      } else {
        const { detail } = await response.json();
        toast.error(detail);
      }
    } else if (user) {
      toast.error(
        "Insufficient balance. Visit your profile to deposit more money.",
      );
    }
    setPending(false);
  }

  function calculateOddsAndPayout(wager: number, odds: number): number {
    const decimalOdds = odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1;

    const totalPayout = wager * decimalOdds;
    return Number(totalPayout.toFixed(2));
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div
          data-clickable="true"
          onClick={handleClickOdds}
          onClickCapture={handleClickOdds}
        >
          {children}
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent
        className={`${isBetPlaced ? "p-0 font-montserrat" : ""}`}
      >
        {isBetPlaced ? (
          <BetPlacedAlert
            betTypeToString={betTypeToString}
            type={type}
            teams={teams}
            odds={odds!}
            wager={wager!}
            payout={payout!}
            setIsBetPlaced={setIsBetPlaced}
          />
        ) : (
          <>
            <AlertDialogCancel className="p-3 cursor-pointer" asChild>
              <span className="absolute top-1 right-3">X</span>
            </AlertDialogCancel>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-1"
              >
                <AlertDialogHeader>
                  <div className="flex justify-between mt-4">
                    <span className="font-semibold text-blue-400 tracking-tight">
                      Betslip
                    </span>
                    <span className="text-sm tracking-tight font-thin">
                      $10 wins ${calculateOddsAndPayout(10, odds!)}
                    </span>
                  </div>
                </AlertDialogHeader>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {betTypeToString[type].title}
                      </span>
                      <span className="text-[11px] dark:text-gray-400 text-gray-500 tracking-wide">
                        {betTypeToString[type].desc}
                      </span>
                    </div>
                    <div>
                      {odds && odds > 0
                        ? `+${odds!.toString().replace(/\.?0+$/, "")}`
                        : odds && odds.toString().replace(/\.?0+$/, "")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full">
                    <FormField
                      control={form.control}
                      name="wager"
                      render={({ field }) => (
                        <FormItem className="w-1/2 flex-1">
                          <FormControl>
                            <DollarInput
                              field={field}
                              setAmount={setWager}
                              label="Wager"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      className={`h-14 p-0 rounded-sm self-start tracking-wide flex flex-1 w-1/2 flex-row items-center justify-center ${pending || wager === undefined || +wager <= 0 ? "bg-slate-500 text-black font-light" : "bg-green-600/80 hover:bg-green-800 text-white"} text-sm shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`}
                      aria-disabled={
                        pending || wager === undefined || +wager <= 0
                      }
                      disabled={pending || wager === undefined || +wager <= 0}
                    >
                      {pending ? (
                        <div className="rounded-full h-8 border-b-2 border-gray-900 dark:border-white">
                          <Loader className="animate-spin" />
                        </div>
                      ) : !wager || +wager < 0 ? (
                        "Enter wager amount"
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-sm font-[400]">
                            Accept and place bet
                          </span>
                          <span className="tracking-tight text-xs font-light">
                            TO WIN: ${calculateOddsAndPayout(+wager, odds!)}
                          </span>
                        </div>
                      )}
                    </Button>{" "}
                  </div>
                </div>
              </form>
            </Form>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
