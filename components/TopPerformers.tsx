"use client";

import { VStack, Heading, HStack, useColorModeValue } from "@chakra-ui/react";
import { format, isToday, parse } from "date-fns";
import { PerformerCard } from "../components/PerformerCard";
import { Spinner } from "@chakra-ui/react";
import startCase from "lodash/startCase";
import {
  useLastPlayedGameDate,
  getDateFromGameDate,
} from "@/hooks/useLastPlayedGameDate";
import { usePathname } from "next/navigation";
import getGameIds from "@/actions/getGameIds";
import { useMemo } from "react";
import useSWR from "swr";
import useLeaders from "@/hooks/useLeaders";
import type { PlayerStatistics } from "@/types";

type SectionProps = {
  leaders: ReturnType<typeof useLeaders>["pointLeaders"];
  category: keyof PlayerStatistics;
};

// display a category and its leaders
const Section = ({ leaders, category }: SectionProps) => {
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
        {leaders.map((leader) => (
          <PerformerCard
            key={`${leader.personId}-${category}`}
            player={leader}
            category={category}
          />
        ))}
      </HStack>
    </VStack>
  );
};

export const TopPerformers = () => {
  const {date : lastDate, isLoading, error} = useLastPlayedGameDate();
  const pathname = usePathname();
  let date : string | undefined;
  if (pathname === '/') {
    // get the last game date if user did ask for a specific date
    if (!isLoading && lastDate) {
      date = lastDate;
    }
  } else {
    // user asked for a specific date, get it from the url
    date = pathname.split('/').pop();
    // convert it to format of mm-dd-yyyy
    date = format(parse(date!, 'yyyy-MM-dd', new Date()), 'MM-dd-yyyy');
  }

  // get all the gameIds once date is available
  const {
    data,
    isValidating: gameIdsLoading,
    error: gameIdsError
  } = useSWR(
    date ? `/api/gameIds/${date}` : null,
    async (url) => {
      const formattedDate = format(parse(date!, 'MM-dd-yyyy', new Date()), 'yyyy-MM-dd');
      return await getGameIds(formattedDate);
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  // get all leaders once date is available
  const { pointLeaders, assistLeaders, reboundLeaders, stealLeaders, blockLeaders } = useLeaders(data?.gameIds, data?.shouldRefreshStats);

  return (
    // VStack separating the "Top Performers" text and each category section
    <VStack w={"full"} align={"start"} px={4} py={8} spacing={12}>
      <Heading fontSize={"3xl"} fontWeight={"normal"} mb={-4}>
        {date ? isToday(parse(date, 'MM-dd-yyyy', new Date()))
          ? `Today's Top Performers`
          : `Top Performers for ${format(parse(date, 'MM-dd-yyyy', new Date()), "MMMM do")}` : <Spinner />}
      </Heading>
      <Section leaders={pointLeaders} category={"points"} />
      <Section leaders={assistLeaders} category={"assists"} />
      <Section leaders={reboundLeaders} category={"reboundsTotal"} />
      <Section leaders={stealLeaders} category={"steals"} />
      <Section leaders={blockLeaders} category={"blocks"} />

    </VStack>
  );
};
