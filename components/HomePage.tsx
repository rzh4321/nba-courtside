"use client";

import { format, isToday, isYesterday, parse } from "date-fns";

import { useQuery } from "@tanstack/react-query";
import useLeaders from "@/hooks/useLeaders";
import useTopPerformersDate from "@/hooks/useTopPerformersDate";
import { useState } from "react";
import LiveOddsPage from "./LiveOddsPage";
import TopPerformers from "./TopPerformers";

export default function HomePage() {
  // get the last date that had games played, excluding today if no games have started yet
  const { date, error } = useTopPerformersDate();
  const [showTopPerformers, setShowTopPerformers] = useState(true);
  // get all the gameIds once game date is available
  const {
    data,
    isLoading: gameIdsLoading,
    error: gameIdsError,
  } = useQuery({
    queryKey: ["gameIds", date],
    queryFn: async () => {
      const res = await fetch(`/api/gameIds/${date}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  // get all leaders once the gameIds are available
  const {
    pointLeaders,
    assistLeaders,
    reboundLeaders,
    stealLeaders,
    blockLeaders,
    isLoading: useLeadersLoading,
  } = useLeaders(data?.gameIds, data?.shouldRefreshStats);
  return (
    <div className="w-full flex flex-col items-start px-4 py-8 gap-12">
      <nav className="flex gap-10 items-center">
        <h1
          onClick={() => setShowTopPerformers(true)}
          className={`-mb-4 text-3xl font-normal cursor-pointer ${showTopPerformers ? "" : "dark:text-gray-300 dark:hover:text-white hover:text-gray-600"}`}
        >
          {date ? (
            isToday(parse(date, "MM-dd-yyyy", new Date())) ? (
              `Today's Top Performers`
            ) : isYesterday(parse(date, "MM-dd-yyyy", new Date())) ? (
              `Top Performers from Yesterday`
            ) : (
              `Top Performers from ${format(parse(date, "MM-dd-yyyy", new Date()), "MMMM do")}`
            )
          ) : date === undefined ? (
            `Today's Top Performers`
          ) : (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
          )}
        </h1>
        <h1
          onClick={() => setShowTopPerformers(false)}
          className={`-mb-4 text-3xl flex gap-2 items-center font-normal cursor-pointer ${!showTopPerformers ? "" : "dark:text-gray-300 dark:hover:text-white hover:text-gray-600"}`}
        >
          {`Live Odds`}
          <div className="size-4 hidden sm:block relative top-[2px] rounded-full bg-red-600 animate-pulse"></div>
        </h1>
      </nav>

      {showTopPerformers ? (
        <TopPerformers
          pointLeaders={pointLeaders}
          assistLeaders={assistLeaders}
          reboundLeaders={reboundLeaders}
          stealLeaders={stealLeaders}
          blockLeaders={blockLeaders}
          gameIdsLoading={gameIdsLoading}
          useLeadersLoading={useLeadersLoading}
          date={date}
        />
      ) : (
        <LiveOddsPage />
      )}
    </div>
  );
}
