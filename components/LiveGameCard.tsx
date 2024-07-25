import { VStack, Text, useColorModeValue, Show } from "@chakra-ui/react";
import NextLink from "next/link";
import type { ParsedGames } from "@/utils/mappers";
import { GAME_STATUS } from "@/constants";

export type LiveGameCardProps = {
  game: ParsedGames[0];
};

export const LiveGameCard = ({ game }: LiveGameCardProps) => {
  const hasBoxscore = game.gameStatus !== GAME_STATUS.NOT_STARTED; // no boxscore if game hasnt started
  const isLive = game.gameStatus === GAME_STATUS.IN_PROGRESS;
  const bg = useColorModeValue("white", "gray.700");
  const quarterColor = useColorModeValue(
    isLive ? "darkgreen" : "black",
    isLive ? "lightgreen" : "gray.400",
  );

  return (
    <NextLink href={hasBoxscore ? `/boxscore/${game.gameId}` : "#"}>
      {/* in larger screens, make its width bigger */}
      <Show above="sm">
        {/* VStack separating the quarter/time and scores */}
        <VStack
          align={"start"}
          spacing={2}
          w={"135px"}
          px={4}
          py={2}
          bg={bg}
          rounded={"md"}
        >
          <Text
            fontSize={"md"}
            color={quarterColor}
            fontWeight={game.gameStatus === GAME_STATUS.ENDED ? "bold" : "semibold"}
          >
            {game.gameStatusText}
          </Text>
          <VStack spacing={0} align={"start"}>
            <Text
              fontWeight={"semibold"}
              letterSpacing={"wider"}
              fontSize={game.awayTeam.score > game.homeTeam.score ? "lg" : "md"}
            >
              {game.awayTeam.teamTricode} - {game.awayTeam.score}
            </Text>
            <Text
              fontWeight={"semibold"}
              letterSpacing={"wider"}
              fontSize={game.homeTeam.score > game.awayTeam.score ? "lg" : "md"}
            >
              {game.homeTeam.teamTricode} - {game.homeTeam.score}
            </Text>
          </VStack>
        </VStack>
      </Show>
      {/* make width smaller in smaller screens */}
      <Show below="sm">
        <VStack
          align={"start"}
          spacing={2}
          w={"120px"}
          px={4}
          py={2}
          bg={bg}
          rounded={"md"}
        >
          <Text
            fontSize={"md"}
            color={quarterColor}
            fontWeight={game.gameStatus === GAME_STATUS.ENDED ? "bold" : "semibold"}
          >
            {game.gameStatusText}
          </Text>
          <VStack spacing={0} align={"start"}>
            <Text
              fontWeight={"semibold"}
              letterSpacing={"wide"}
              fontSize={game.homeTeam.score > game.awayTeam.score ? "md" : "sm"}
            >
              {game.homeTeam.teamTricode} - {game.homeTeam.score}
            </Text>
            <Text
              fontWeight={"semibold"}
              letterSpacing={"wide"}
              fontSize={game.awayTeam.score > game.homeTeam.score ? "md" : "sm"}
            >
              {game.awayTeam.teamTricode} - {game.awayTeam.score}
            </Text>
          </VStack>
        </VStack>
      </Show>
    </NextLink>
  );
};
