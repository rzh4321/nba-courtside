"use client";

import { VStack, Heading, HStack, useColorModeValue } from "@chakra-ui/react";
import { format, isToday, parse, isFuture, endOfDay } from "date-fns";
import { PerformerCard } from "../components/PerformerCard";
import { Spinner } from "@chakra-ui/react";
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
  const categoryColor = useColorModeValue("gray.700", "gray.400");
  return (
    <VStack w={"100%"} align={"start"} spacing={4}>
      <Heading fontSize={"2xl"} color={categoryColor} fontWeight={"normal"}>
        {/* startCase turns string into words starting with uppercase, like hello world to Hello World */}
        {startCase(category).split(" ")[0]}
      </Heading>
      {/* put each player card in an HStack that wraps on smaller screens */}
      <HStack
        w={"full"}
        spacing={8}
        flexWrap={"wrap"}
        className="flex-performers"
      >
        {/* display leaders for this category */}
        {isLoading ? (
          <Spinner />
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
      </HStack>
    </VStack>
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
    // VStack separating the "Top Performers" text and each category section
    <VStack w={"full"} align={"start"} px={4} py={8} spacing={12}>
      <Heading fontSize={"3xl"} fontWeight={"normal"} mb={-4}>
        {date ? (
          isToday(parse(date, "MM-dd-yyyy", new Date())) ? (
            `Today's Top Performers`
          ) : (
            `Top Performers for ${format(parse(date, "MM-dd-yyyy", new Date()), "MMMM do")}`
          )
        ) : date === undefined ? (
          `Today's Top Performers`
        ) : (
          <Spinner />
        )}
      </Heading>
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
    </VStack>
  );
};
