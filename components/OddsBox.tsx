import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
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
};

export default function OddsBox({
  children,
  type,
  odds,
  bettingLine,
  gameId,
  teams,
  gameEnded,
}: Props) {
  const [pending, setPending] = useState(false);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const [payout, setPayout] = useState<undefined | string>();
  const [prevWager, setPrevWager] = useState<undefined | string>();
  const [wager, setWager] = useState<undefined | string>();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
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
      bettingLine === null ||
      bettingLine === undefined ||
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
    const res = await fetch(`/api/boxscore/${gameId}`);
    const data = await res.json();
    const gameEnded = data.gameStatus === GAME_STATUS.ENDED;
    if (gameEnded) {
      const res = await bettingService.markGameEnded(gameId);
      console.log(res);
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
          ...(bettingLine !== undefined && { bettingLine }),
        }),
      });
      if (response.ok) {
        const res = await response.json();
        console.log(res);
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
                            <WagerInput field={field} setWager={setWager} />
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
                        <div className="animate-spin rounded-full h-8 border-b-2 border-gray-900 dark:border-white" />
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

const WagerInput = ({
  field,
  setWager,
}: {
  field: any;
  setWager: React.Dispatch<React.SetStateAction<undefined | string>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setWager(field.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    const regex = /^\d*\.?\d{0,2}$/;

    if (regex.test(inputValue) || inputValue === "") {
      field.onChange(e);
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div
      className="relative inline-block w-full"
      onClick={handleContainerClick}
    >
      <div
        className={`relative rounded-sm ${isFocused ? "ring-1 ring-blue-500" : ""}`}
      >
        <div
          className={`border ${isFocused ? "border-blue-500" : "border-gray-600"} rounded-sm h-14 relative transition-colors duration-200`}
        >
          <span
            className={`absolute text-xs cursor-default ${isFocused ? "text-blue-500" : "dark:text-white text-black"} font-light left-3 top-2`}
          >
            WAGER
          </span>

          <span
            className={`absolute cursor-default dark:text-white text-black font-light left-3 top-[22px] text-md pointer-events-none`}
          >
            $
          </span>

          <Input
            {...field}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={inputRef}
            id="wager"
            type="number"
            name="wager"
            required
            className="absolute bottom-0 focus-visible:ring-0 border-none focus:ring-0 focus:border-none focus:outline-none dark:text-white active:outline-none left-[-7px] w-full h-9 pl-8 pb-2 bg-transparent outline-none text-lg"
          />
        </div>
      </div>
    </div>
  );
};
