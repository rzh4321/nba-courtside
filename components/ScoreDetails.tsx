import {
  Box,
  Text,
  Flex,
  VStack,
  HStack,
  Badge,
  Show,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";
import type { Boxscore, Team } from "@/types";

type TeamDetailsProps = {
  team: Team;
  reverse?: boolean;
};

const TeamDetails = ({ team, reverse = false }: TeamDetailsProps) => {
  const bg = useColorModeValue("white", "gray.600");

  return (
    <Flex
      direction={reverse ? "row-reverse" : "row"}
      gap={2}
      alignItems={"center"}
    >
      <Image
        src={`https://cdn.nba.com/logos/nba/${team.teamId}/primary/L/logo.svg`}
        width={75}
        height={75}
        alt={team.teamName}
      />
      {/* display the tricode and score */}
      <Show above="sm">
        <Box textAlign={reverse ? "right" : "left"}>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            {team.teamTricode}
          </Text>
          <Text fontSize={"3xl"} fontWeight={"bold"} mt={-2}>
            {team.score}
          </Text>
        </Box>
      </Show>
      <Show below="sm">
        <Box textAlign={reverse ? "right" : "left"} margin={-2}>
          <Text fontSize={"md"} fontWeight={"bold"}>
            {team.teamTricode}
          </Text>
          <Text fontSize={"2xl"} fontWeight={"bold"} mt={-2}>
            {team.score}
          </Text>
        </Box>
      </Show>
    </Flex>
  );
};

export type ScoreDetailsProps = {
  boxscore: Boxscore;
};

export const ScoreDetails = ({ boxscore }: ScoreDetailsProps) => {
  const isLive = boxscore.gameStatus === 2;

  const bg = useColorModeValue("white", "gray.600");

  return (
    <Box p={4} bg={bg} rounded={"lg"} shadow={"lg"} w={"full"} maxW={"480px"}>
      {/* HStack for separating teamA, the game status, and teamB */}
      <HStack justify={"space-between"} align={"center"}>
        <TeamDetails team={boxscore.homeTeam} />
        {/* VStack for separating the game status and "LIVE" */}
        <VStack spacing={1}>
          <Text>{boxscore.gameStatusText}</Text>
          {isLive && <Badge colorScheme={"red"}>LIVE</Badge>}
        </VStack>
        {/* reverse the team details for teamB to make it symmetrical */}
        <TeamDetails team={boxscore.awayTeam} reverse />
      </HStack>
    </Box>
  );
};
