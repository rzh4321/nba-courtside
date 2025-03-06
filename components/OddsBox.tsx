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
import { useState } from "react";
import { API_URL } from "@/config";
import useAuth from "@/hooks/useAuth";

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
  const { isAuthenticated, loading: authLoading } = useAuth();
  const token = localStorage.getItem("token");
  const betTypeToString = {
    SPREAD_HOME: {
      title: `${teams.home} ${bettingLine}`,
      desc: "SPREAD BETTING",
    },
    SPREAD_AWAY: {
      title: `${teams.away} ${bettingLine}`,
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
      wager: 0,
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
            <DialogHeader className="flex justify-between">
              <span className="font-bold text-blue-400 tracking-tight">
                Betslip
              </span>
              <span className="text-sm tracking-tight">
                $10 wins ${calculateOddsAndPayout(odds!)}
              </span>
            </DialogHeader>

            <div className="">
              <div className="justify-between">
                <div>
                  <span>{betTypeToString[type].title}</span>
                  <span>{betTypeToString[type].desc}</span>
                </div>
                <div>{odds! > 0 ? `+${odds}` : odds}</div>
              </div>
              <FormField
                control={form.control}
                name="wager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="wager"
                      className="mb-3 mt-5 block text-xs font-medium"
                    >
                      Wager
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          className="peer text-base w-full block rounded-md border bg-zinc-50 px-2 py-[9px] sm:text-sm outline-none placeholder:text-zinc-500"
                          id="wager"
                          type="number"
                          name="wager"
                          required
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="my-6 flex sm:h-10 border-blue-600 w-full flex-row items-center justify-center rounded-md bg-[#6366f1] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#4f46e5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                aria-disabled={pending}
                disabled={pending}
              >
                {pending ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
                ) : (
                  "Log in"
                )}
              </Button>{" "}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
