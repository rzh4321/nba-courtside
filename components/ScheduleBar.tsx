import {
  Flex,
  VStack,
  Text,
  HStack,
  Container,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { format, parse } from "date-fns";
import { useScoreboard } from "@/hooks/useScoreboard";
import { LiveGameCard } from "./LiveGameCard";
import { LiveGame, ScoreboardResponse } from "@/types";
import "@/global.css";

export const ScheduleBar = () => {
  // call api every 20 secs to get updated scoreboard
  const { data, isLoading } = useScoreboard();
  const bg = useColorModeValue("gray.700", "gray.900");

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
                  parse(data.scoreboard.gameDate, "yyyy-MM-dd", new Date()),
                  "EEEE, MMMM do",
                )}
              </Text>
            )}
          </HStack>
          {/* scrollable class removes scrollbar, auto overflow makes it scrollable at all */}
          <HStack w={"full"} className="scrollable" overflow={"auto"}>
            {isLoading ? (
              <Text>Loading</Text>
            ) : !data ? (
              <Text>There was an error</Text>
            ) : data.scoreboard.games.length > 0 ? (
              // all the game cards are in an HStack with a gap of 8
              <HStack spacing={8}>
                {data.scoreboard.games.map((game: LiveGame) => (
                  <LiveGameCard key={game.gameId} game={game} />
                ))}
              </HStack>
            ) : (
              <Flex w={"full"} color={"gray.500"} fontWeight={"semibold"}>
                <Text>No games scheduled for today</Text>
              </Flex>
            )}
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
};
