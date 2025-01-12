import { VStack, Text, useColorModeValue, Show } from "@chakra-ui/react";
import NextLink from "next/link";
import type { ParsedGames } from "@/utils/mappers";
import { GAME_STATUS } from "@/constants";
import { useSearchParams } from "next/navigation";

export type LiveGameCardProps = {
  game: ParsedGames[0];
};

function convertISODurationToMMSS(duration: string): string {
  const trimmedDuration = duration.trim();
  if (trimmedDuration === "") return "";

  // Check if already in m:ss or mm:ss format, including when minutes is 0
  if (/^[0-9]{1,2}:[0-9]{2}$/.test(trimmedDuration)) {
    return trimmedDuration;
  }

  // Convert from ISO duration
  const matches = trimmedDuration.match(/PT(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);

  if (!matches) {
    console.log(trimmedDuration);
    throw new Error("Invalid duration format");
  }

  const minutes = parseInt(matches[1] || "0");
  const seconds = matches[2] ? Math.round(parseFloat(matches[2])) : 0;
  const paddedSeconds = seconds.toString().padStart(2, "0");

  return `${minutes}:${paddedSeconds}`;
}

export const LiveGameCard = ({ game }: LiveGameCardProps) => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const hasBoxscore = game.gameStatus !== GAME_STATUS.NOT_STARTED; // no boxscore if game hasnt started
  const isLive = game.gameStatus === GAME_STATUS.IN_PROGRESS;
  const bg = useColorModeValue("white", "gray.700");
  const quarterColor = useColorModeValue(
    isLive ? "darkgreen" : "black",
    isLive ? "lightgreen" : "gray.400",
  );
  // console.log('statustext: ', game.gameStatusText)
  // console.log('gameclock: ', game.gameClock)
  // console.log('gamestatus: ', game.gameStatus)
  // console.log('gameperiod: ', game.period)
  return (
    <NextLink
      href={
        hasBoxscore
          ? `/boxscore/${game.gameId}${date ? "?date=" + date : ""}`
          : date
            ? "?date=" + date
            : "#"
      }
    >
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
            fontWeight={
              game.gameStatus === GAME_STATUS.ENDED ? "bold" : "semibold"
            }
          >
            {game.gameStatus === 2 &&
            game.gameStatusText.trim() != "Halftime" &&
            !game.gameStatusText.trim().includes("OT") &&
            !game.gameStatusText.trim().includes("vertime")
              ? `Q${game.period} ${convertISODurationToMMSS(game.gameClock)}`
              : game.gameStatusText}
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
          h={"112px"}
          px={4}
          py={2}
          bg={bg}
          rounded={"md"}
        >
          <Text
            fontSize={"md"}
            color={quarterColor}
            fontWeight={
              game.gameStatus === GAME_STATUS.ENDED ? "bold" : "semibold"
            }
          >
            {game.gameStatus === 2 &&
            game.gameStatusText.trim() != "Halftime" &&
            !game.gameStatusText.trim().includes("OT") &&
            !game.gameStatusText.trim().includes("vertime")
              ? `Q${game.period} ${convertISODurationToMMSS(game.gameClock)}`
              : game.gameStatusText}
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
