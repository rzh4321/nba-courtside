"use client";
import useUserBets from "@/hooks/useUserBets";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import { useState } from "react";
import BetCard from "@/components/BetCard";

export default function Page() {
  const [showActiveBets, setShowActiveBets] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { loading, activeBets, settledBets, error } = useUserBets();
  const router = useRouter();
  if (!authLoading && !isAuthenticated) router.push("/");

  const betDivs = (showActiveBets ? activeBets : settledBets).map((bet) => (
    <BetCard key={bet.id} bet={bet} />
  ));
  const loadingSkeleton = Array.from({ length: 3 }).map((num, i) => (
    <div
      key={i}
      className="w-full h-[90px] animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md"
    ></div>
  ));

  return (
    <div className="w-full flex flex-col px-4 py-8">
      <nav className="flex gap-10 items-center">
        <h1
          onClick={() => setShowActiveBets(true)}
          className={`-mb-4 text-3xl font-normal cursor-pointer ${showActiveBets ? "" : "dark:text-gray-300 dark:hover:text-white hover:text-gray-600"}`}
        >
          Open
        </h1>
        <h1
          onClick={() => setShowActiveBets(false)}
          className={`-mb-4 text-3xl font-normal cursor-pointer ${!showActiveBets ? "" : "dark:text-gray-300 dark:hover:text-white hover:text-gray-600"}`}
        >
          Settled
        </h1>
      </nav>
      <div className="flex flex-col gap-5 mt-8">
        {loading ? loadingSkeleton : error ? "error" : betDivs}
      </div>
    </div>
  );
}
