"use client";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DepositMoneyForm from "@/components/DepositMoneyForm";

export default function Page() {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();
  if (!authLoading && !isAuthenticated) router.push("/");

  if (!authLoading && !isAuthenticated) return;

  return (
    <div className="flex flex-col gap-1 mb-8">
      <div className="w-full p-4 mt-8 flex gap-4 items-center border-[0.5px] shadow-lg border-slate-800 dark:bg-gray-700 bg-white rounded-md">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span
          className={`text-xl tracking-wide font-light ${authLoading && "animate-pulse w-[150px] h-[28px] rounded-md bg-gray-200 dark:bg-gray-600"}`}
        >
          {authLoading ? "" : user?.username}
        </span>
      </div>
      <div className="w-full p-4 my-8 flex justify-between bg-gradient-to-r from-blue-500 dark:from-blue-600 to-blue-800 dark:to-blue-800 rounded-md">
        <div className="flex flex-col gap-1">
          <span
            className={`text-3xl text-white font-bold ${authLoading && "animate-pulse w-[138px] h-[36px] rounded-md bg-white dark:bg-blue-500"}`}
          >
            {authLoading ? "" : `$${user?.balance}`}
          </span>
          <span className="font-light text-white">Playable balance</span>
        </div>
        <div className="w-[200px] hidden sm:block">
          <DepositMoneyForm />
        </div>
      </div>
      <div className="sm:hidden w-[200px]">
        <DepositMoneyForm />
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-semibold text-xl">Career stats</span>
        <div className="w-full p-4 flex flex-col gap-4 items-center border-[0.5px] border-slate-800 dark:bg-gray-700 bg-white rounded-md">
          <div className="w-full flex flex-col gap-1 dark:bg-gray-700 bg-white rounded-md">
            <span
              className={`text-3xl dark:text-white font-bold ${authLoading && "animate-pulse w-[138px] h-[36px] rounded-md bg-gray-200 dark:bg-gray-600"}`}
            >
              {authLoading
                ? ""
                : `$${(user!.amount_won - user!.amount_placed).toFixed(2)}`}
            </span>
            <span className="font-light dark:text-white">Net total</span>
          </div>
          <div className="border-t-[1px] w-full pt-3 flex flex-col gap-4">
            <span className="font-light">
              {`Here's how much you've bet and won since you joined Courtside on ${
                authLoading
                  ? ""
                  : new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }).format(new Date(user!.created_at))
              }`}
            </span>
            <div className="flex justify-between font-bold">
              <span>Winnings</span>
              <span
                className={`${authLoading && "animate-pulse w-[73px] h-[24px] rounded-md bg-gray-200 dark:bg-gray-600"}`}
              >
                {authLoading ? "" : `$${user!.amount_won}`}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Bets</span>
              <span
                className={`${authLoading && "animate-pulse w-[73px] h-[24px] rounded-md bg-gray-200 dark:bg-gray-600"}`}
              >
                {authLoading ? "" : `$${user!.amount_placed}`}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Deposited</span>
              <span
                className={`${authLoading && "animate-pulse w-[73px] h-[24px] rounded-md bg-gray-200 dark:bg-gray-600"}`}
              >
                {authLoading ? "" : `$${user!.amount_deposited}`}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Bets Won</span>
              <span
                className={`${authLoading && "animate-pulse w-[73px] h-[24px] rounded-md bg-gray-200 dark:bg-gray-600"}`}
              >
                {authLoading ? "" : `${user!.bets_won}`}
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Bets Placed</span>
              <span
                className={`${authLoading && "animate-pulse w-[73px] h-[24px] rounded-md bg-gray-200 dark:bg-gray-600"}`}
              >
                {authLoading ? "" : `${user!.bets_placed}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
