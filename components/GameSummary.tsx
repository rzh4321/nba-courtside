import { Boxscore, Period } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function GameSummary({ game }: { game: Boxscore }) {
  const renderPeriods = (periods: Period[], isHeader = false) =>
    periods.map(({ period, score }, index: number) => {
      const key = isHeader ? period : score;
      const content = isHeader
        ? period > 4
          ? `OT${period - 4}`
          : `Q${period}`
        : score;

      return isHeader ? (
        <TableHead className="font-bold p-3 tracking-wider" key={index}>
          {content}
        </TableHead>
      ) : (
        <TableCell key={index} className="p-3 tracking-wider">
          {content}
        </TableCell>
      );
    });

  return (
    <div className=" bg-white dark:bg-gray-600 rounded-lg px-3">
      <Table className="w-full font-mono">
        <TableHeader>
          <TableRow>
            <TableHead className="font-montserrat font-bold tracking-wider">
              TEAM
            </TableHead>
            {renderPeriods(game.homeTeam.periods, true)}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{game.awayTeam.teamName}</TableCell>
            {renderPeriods(game.awayTeam.periods)}
          </TableRow>
          <TableRow>
            <TableCell>{game.homeTeam.teamName}</TableCell>
            {renderPeriods(game.homeTeam.periods)}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

export default GameSummary;
