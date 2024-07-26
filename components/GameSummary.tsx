import { Boxscore, Period } from "@/types";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

import { useColorModeValue } from "@chakra-ui/react";

function GameSummary({ game }: { game: Boxscore }) {
  const bg = useColorModeValue("white", "gray.600");

  const renderPeriods = (periods: Period[], isHeader = false) =>
    periods.map(({ period, score }, index: number) => {
      const key = isHeader ? period : score;
      const content = isHeader
        ? period > 4
          ? `OT${period - 4}`
          : `Q${period}`
        : score;

      return isHeader ? (
        <Th key={index}>{content}</Th>
      ) : (
        <Td key={index}>{content}</Td>
      );
    });

  return (
    <div>
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
            <Th>Team</Th>
            {renderPeriods(game.homeTeam.periods, true)}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{game.homeTeam.teamName}</Td>
            {renderPeriods(game.homeTeam.periods)}
          </Tr>
          <Tr>
            <Td>{game.awayTeam.teamName}</Td>
            {renderPeriods(game.awayTeam.periods)}
          </Tr>
        </Tbody>
      </Table>
    </div>
  );
}

export default GameSummary;
