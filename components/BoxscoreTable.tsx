import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Team } from "@/types";

export type BoxscoreProps = {
  isLive: boolean;
  team: Team;
};

export const BoxscoreTable = ({ isLive, team }: BoxscoreProps) => {
  // get color values from the current color mode
  const bg = useColorModeValue("white", "gray.600");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  function formatMinutes(minutes: string) {
    const match = minutes.match(/[0-9]+/);
    return match
      ? match[0] === "00"
        ? "—"
        : match[0].replace(/^0+/, "")
      : "—";
  }

  function formatPlusMinus(plusMinus: number) {
    if (plusMinus > 0) {
      return `+${plusMinus}`;
    }
    return plusMinus;
  }

  return (
    <Box w={"full"} overflowX={"auto"}>
      {/* VStack separating the team name and box score */}
      <VStack w={"full"} spacing={2} align={"start"}>
        <Text fontWeight={"semibold"} letterSpacing={"widest"}>
          {team.teamName.toUpperCase()}
        </Text>
        <Table
          w={"full"}
          variant={"simple"}
          bg={bg}
          size={"sm"}
          rounded={"md"}
          fontFamily={"mono"}
        >
          <Thead>
            <Tr>
              <Th minW={"190px"}>Name</Th>
              <Th isNumeric>Min</Th>
              <Th isNumeric>FG</Th>
              <Th isNumeric>3PT</Th>
              <Th isNumeric>FT</Th>
              <Th isNumeric>Reb</Th>
              <Th isNumeric>Ast</Th>
              <Th isNumeric>Pts</Th>
              <Th isNumeric>+/-</Th>
            </Tr>
          </Thead>
          <Tbody>
            {team.players.map((player, i) => (
              <Tr
                key={player.personId}
                borderBottom={i === 4 ? "4px" : "1.5px"}
                borderColor={borderColor}
              >
                <Td display={{ base: "none", xl: "table-cell" }}>
                  {player.firstName} {player.familyName}{" "}
                  {isLive && player.oncourt === "1" && "○"}
                </Td>
                <Td
                  display={{ base: "table-cell", xl: "none" }}
                  fontSize={player.familyName.length >= 10 ? "small" : "small"}
                >
                  {player.firstName[0]} {player.familyName}{" "}
                  {isLive && player.oncourt === "1" && "○"}
                </Td>
                <Td isNumeric>
                  {formatMinutes(player.statistics.minutesCalculated)}
                </Td>
                <Td isNumeric>
                  {player.statistics.fieldGoalsMade}-
                  {player.statistics.fieldGoalsAttempted}{" "}
                </Td>
                <Td isNumeric>
                  {player.statistics.threePointersMade}-
                  {player.statistics.threePointersAttempted}{" "}
                </Td>
                <Td isNumeric>
                  {player.statistics.freeThrowsMade}-
                  {player.statistics.freeThrowsAttempted}{" "}
                </Td>
                <Td isNumeric>{player.statistics.reboundsTotal}</Td>
                <Td isNumeric>{player.statistics.assists}</Td>
                <Td isNumeric>{player.statistics.points}</Td>
                <Td isNumeric>
                  {formatPlusMinus(player.statistics.plusMinusPoints)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
};
