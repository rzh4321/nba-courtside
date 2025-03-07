import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState, useRef, useEffect } from "react";
import { API_URL } from "@/config";
import useAuth from "@/hooks/useAuth";
import { getMoneyline, getSpread } from "@/utils/formatOdds";

const formSchema = z.object({
  wager: z.number().min(1, {
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
};

export default function OddsBox({
  children,
  type,
  odds,
  bettingLine,
  gameId,
  teams,
}: Props) {
  const [pending, setPending] = useState(false);
  const [wager, setWager] = useState();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const token = localStorage.getItem("token");
  const betTypeToString = {
    SPREAD_HOME: {
      title: `${teams.home} ${getSpread(bettingLine, "home")}`,
      desc: "SPREAD BETTING",
    },
    SPREAD_AWAY: {
      title: `${teams.away} ${getSpread(bettingLine, "away")}`,
      desc: "SPREAD BETTING",
    },
    OVER: { title: `Over ${bettingLine}`, desc: "TOTAL POINTS" },
    UNDER: { title: `Under ${bettingLine}`, desc: "TOTAL POINTS" },
    MONEYLINE_HOME: { title: teams.home, desc: "MONEYLINE" },
    MONEYLINE_AWAY: { title: teams.away, desc: "MONEYLINE" },
  };

  const handleClickOdds = (e: React.MouseEvent<HTMLDivElement>) => {
    if (authLoading) return;

    const target = e.target as HTMLElement;
    const isClickableElement = target.getAttribute("data-clickable") === "true";

    if (!isAuthenticated) {
      document.getElementById("logInButton")?.click();
      e.stopPropagation();
      return;
    }

    if ((odds === null || bettingLine === null) && isClickableElement) {
      e.stopPropagation();
      return;
    }

    console.log("wager dialog");
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wager: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
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
      console.log("RES AFTER PLACING BET: ", res);
      toast.success(`success`);
    } else {
      const { detail } = await response.json();
      toast.error(detail);
      setPending(false);
    }
  }

  function calculateOddsAndPayout(odds: number): number {
    const decimalOdds = odds > 0 ? odds / 100 + 1 : 100 / Math.abs(odds) + 1;

    const totalPayout = 10 * decimalOdds;
    return Number(totalPayout.toFixed(2));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div onClick={handleClickOdds} onClickCapture={handleClickOdds}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-1"
          >
            <DialogHeader>
              <div className="flex justify-between mt-4">
                <span className="font-semibold text-blue-400 tracking-tight">
                  Betslip
                </span>
                <span className="text-sm tracking-tight font-thin">
                  $10 wins ${calculateOddsAndPayout(odds!)}
                </span>
              </div>
            </DialogHeader>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {betTypeToString[type].title}
                  </span>
                  <span className="text-[11px] text-gray-400 tracking-wide">
                    {betTypeToString[type].desc}
                  </span>
                </div>
                <div>
                  {odds! > 0
                    ? `+${odds!.toString().replace(/\.?0+$/, "")}`
                    : odds!.toString().replace(/\.?0+$/, "")}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className={`h-14 p-0 rounded-sm self-start tracking-wide flex flex-1 w-1/2 flex-row items-center justify-center ${pending || wager === undefined || wager <= 0 ? "bg-slate-500 text-black font-light" : "bg-green-600 hover:bg-green-700 text-white"} text-sm shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50`}
                  aria-disabled={pending || wager === undefined || wager <= 0}
                  disabled={pending || wager === undefined || wager <= 0}
                >
                  {pending ? (
                    <div className="animate-spin rounded-full h-8 border-b-2 border-gray-900 dark:border-white" />
                  ) : (
                    "Enter wage amount"
                  )}
                </Button>{" "}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const WagerInput = ({
  field,
  setWager,
}: {
  field: any;
  setWager: React.Dispatch<React.SetStateAction<undefined>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setWager(field.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);
  console.log(field.value);

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
            className={`absolute text-xs cursor-default ${isFocused ? "text-blue-500" : "text-white"} font-light left-3 top-2`}
          >
            WAGER
          </span>

          <span
            className={`absolute cursor-default text-white font-light left-3 top-[22px] text-md pointer-events-none`}
          >
            $
          </span>

          <Input
            {...field}
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
