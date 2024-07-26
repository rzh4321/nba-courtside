import {
  Flex,
  VStack,
  Text,
  HStack,
  Container,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { format, parse, isToday } from "date-fns";
import { useSchedule } from "@/hooks/useSchedule";
import { LiveGameCard } from "./LiveGameCard";
import { useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import getDays from "@/utils/getDays";
import { DATE_LINK_FORMAT } from "@/constants";
import Link from "next/link";
import DatePicker from "./DatePicker";
import "@/global.css";

export const ScheduleBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const date = searchParams.get("date");
  const today = format(new Date(), DATE_LINK_FORMAT);
  // date is in the format of yyyy-MM-dd
  const dateWithDashes = date ? date : new Date().toLocaleDateString("en-CA");
  const { day, prevDay, nextDay } = getDays(dateWithDashes);
  const { data, isLoading, error } = useSchedule(dateWithDashes);

  const bg = useColorModeValue("gray.700", "gray.900");
  const arrowColors = useColorModeValue("white", "black");

  const prevLink = pathname + (prevDay === today ? "?" : `?date=${prevDay}`);
  const nextLink = pathname + (nextDay === today ? "?" : `?date=${nextDay}`);

  return (
    // overall box for the schedule bar
    <Box bg={bg} w={"full"} h={isLoading ? "157px" : "auto"}>
      <Container maxW={"container.lg"}>
        {/* VStack for separaing the "Games for ..." and game cards */}
        <VStack w={"full"} p={4}>
          {/* horizontal stack for the "Games for ..." */}
          <HStack w={"full"}>
            {data && (
              <Text color={"white"} fontWeight={"semibold"}>
                Games for{" "}
                {format(
                  parse(dateWithDashes, "yyyy-MM-dd", new Date()),
                  "EEEE, MMMM do",
                )}
              </Text>
            )}
          </HStack>
          {/* date picker */}
          <HStack alignSelf={"start"}>
            <Link href={prevLink}>
              <ArrowBackIcon color={"white"} />
            </Link>
            <DatePicker day={dateWithDashes} />
            <Link href={nextLink}>
              <ArrowForwardIcon color={"white"} />
            </Link>
          </HStack>
          {/* scrollable class removes scrollbar, auto overflow makes it scrollable at all */}
          <HStack w={"full"} className="scrollable" overflow={"auto"}>
            {isLoading ? (
              <Text>Loading</Text>
            ) : error ? (
              <Text>There was an error when fetching today{"'"}s schedule</Text>
            ) : data!.length > 0 ? (
              // all the game cards are in an HStack with a gap of 8
              <HStack spacing={8}>
                {data!.map((game) => (
                  <LiveGameCard key={game.gameId} game={game} />
                ))}
              </HStack>
            ) : (
              <Flex w={"full"} color={"gray.500"} fontWeight={"semibold"}>
                <Text>
                  No games scheduled for{" "}
                  {isToday(parse(dateWithDashes, "yyyy-MM-dd", new Date()))
                    ? "today"
                    : "this date"}
                </Text>
              </Flex>
            )}
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};
