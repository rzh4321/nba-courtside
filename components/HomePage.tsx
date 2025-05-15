"use client";

import { format, isToday, isYesterday, parse } from "date-fns";

import { useQuery } from "@tanstack/react-query";
import useLeaders from "@/hooks/useLeaders";
import useTopPerformersDate from "@/hooks/useTopPerformersDate";
import { useState } from "react";
import LiveOddsPage from "./LiveOddsPage";
import PerformerSection from "./PerformerSection";

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
          className={`-mb-4 text-3xl font-normal cursor-pointer ${!showTopPerformers ? "" : "dark:text-gray-300 dark:hover:text-white hover:text-gray-600"}`}
        >{`Live Odds`}</h1>
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

type TopPerformersProps = {
  pointLeaders: ReturnType<typeof useLeaders>["pointLeaders"];
  assistLeaders: ReturnType<typeof useLeaders>["assistLeaders"];
  reboundLeaders: ReturnType<typeof useLeaders>["reboundLeaders"];
  stealLeaders: ReturnType<typeof useLeaders>["stealLeaders"];
  blockLeaders: ReturnType<typeof useLeaders>["blockLeaders"];
  gameIdsLoading: boolean;
  useLeadersLoading: boolean;
  date: string | null | undefined;
};

export function TopPerformers({
  pointLeaders,
  assistLeaders,
  reboundLeaders,
  stealLeaders,
  blockLeaders,
  gameIdsLoading,
  useLeadersLoading,
  date,
}: TopPerformersProps) {
  return (
    <>
      <PerformerSection
        leaders={pointLeaders}
        category={"points"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <PerformerSection
        leaders={assistLeaders}
        category={"assists"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <PerformerSection
        leaders={reboundLeaders}
        category={"reboundsTotal"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <PerformerSection
        leaders={stealLeaders}
        category={"steals"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <PerformerSection
        leaders={blockLeaders}
        category={"blocks"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
    </>
  );
}
