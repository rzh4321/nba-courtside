"use client";

import {
  format,
  isToday,
  isYesterday,
  parse,
  isFuture,
  endOfDay,
} from "date-fns";
import { PerformerCard } from "../components/PerformerCard";
import startCase from "lodash/startCase";
import { useLastPlayedGameDate } from "@/hooks/useLastPlayedGameDate";
import { useSearchParams } from "next/navigation";
import getGameIds from "@/actions/getGameIds";
import useSWR from "swr";
import useLeaders from "@/hooks/useLeaders";
import type { PlayerStatistics } from "@/types";

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

export const TopPerformers = () => {
  const {
    date: lastDate,
    dateLoading: isLoading,
    error,
  } = useLastPlayedGameDate();
  const searchParams = useSearchParams();
  let date: null | string | undefined = searchParams.get("date");
  if (date === null) {
    // get the last game date if user didnt ask for a specific date
    if (!isLoading && lastDate) {
      date = lastDate;
    } else {
      // lastDate not found
      date = undefined;
    }
  } else {
    // user asked for a specific date, get it from the url
    // convert it to format of mm-dd-yyyy
    date = format(parse(date, "yyyy-MM-dd", new Date()), "MM-dd-yyyy");
  }
  // console.log('DATE IS ', date)
  // get all the gameIds once date is available
  const {
    data,
    isValidating: gameIdsLoading,
    error: gameIdsError,
  } = useSWR(
    `/api/gameIds/${date}`,
    async (url) => {
      const formattedDate = format(
        parse(date!, "MM-dd-yyyy", new Date()),
        "yyyy-MM-dd",
      );
      return await getGameIds(formattedDate);
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
      <h1 className="-mb-4 text-3xl font-normal">
        {date ? (
          isToday(parse(date, "MM-dd-yyyy", new Date())) ? (
            `Today's Top Performers`
          ) : isYesterday(parse(date, "MM-dd-yyyy", new Date())) ? (
            `Top Performers for Yesterday`
          ) : (
            `Top Performers for ${format(parse(date, "MM-dd-yyyy", new Date()), "MMMM do")}`
          )
        ) : date === undefined ? (
          `Today's Top Performers`
        ) : (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
        )}
      </h1>
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
    </div>
  );
};