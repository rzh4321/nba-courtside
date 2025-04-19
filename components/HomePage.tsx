"use client";

import {
  format,
  isToday,
  isYesterday,
  parse,
  isFuture,
  endOfDay,
} from "date-fns";
import { PerformerCard } from "./PerformerCard";
import startCase from "lodash/startCase";
import useSWR from "swr";
import useLeaders from "@/hooks/useLeaders";
import type { PlayerStatistics } from "@/types";
import useTopPerformersDate from "@/hooks/useTopPerformersDate";
import { useState } from "react";
import LiveOddsPage from "./LiveOddsPage";

type SectionProps = {
  leaders: ReturnType<typeof useLeaders>["pointLeaders"];
  category: keyof PlayerStatistics;
  isLoading: boolean;
  date: string | null | undefined;
};

// display a category and its leaders
const Section = ({ leaders, category, isLoading, date }: SectionProps) => {
  return (
    <div className="w-full flex flex-col items-start gap-4">
      <h2 className="text-2xl text-gray-700 dark:text-gray-400 font-normal">
        {/* startCase turns string into words starting with uppercase, like hello world to Hello World */}
        {startCase(category).split(" ")[0]}
      </h2>
      <div className="w-full flex flex-wrap gap-8 justify-center sm:justify-start">
        {/* display leaders for this category */}
        {isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
        ) : leaders.length > 0 ? (
          leaders.map((leader) => (
            <PerformerCard
              key={`${leader.personId}-${category}`}
              player={leader}
              category={category}
            />
          ))
        ) : date && isFuture(parse(date, "MM-dd-yyyy", new Date())) ? (
          <div>
            Top performers will be displayed here after any games are played
          </div>
        ) : (
          <div>
            No games{" "}
            {date && isToday(parse(date, "MM-dd-yyyy", new Date()))
              ? "are"
              : "were"}{" "}
            scheduled for this date
          </div>
        )}
      </div>
    </div>
  );
};

export default function HomePage() {
  const { date, error } = useTopPerformersDate();
  const [showTopPerformers, setShowTopPerformers] = useState(true);
  // get all the gameIds once date is available
  const {
    data,
    isValidating: gameIdsLoading,
    error: gameIdsError,
  } = useSWR(
    `/api/gameIds/${date}`,
    async (url) => {
      let res = await fetch(url);
      return await res.json();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  // get all leaders once date is available
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

function TopPerformers({
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
      <Section
        leaders={pointLeaders}
        category={"points"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <Section
        leaders={assistLeaders}
        category={"assists"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <Section
        leaders={reboundLeaders}
        category={"reboundsTotal"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <Section
        leaders={stealLeaders}
        category={"steals"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
      <Section
        leaders={blockLeaders}
        category={"blocks"}
        isLoading={gameIdsLoading || useLeadersLoading}
        date={date}
      />
    </>
  );
}
