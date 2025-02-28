import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Team } from "@/types";

export type BoxscoreProps = {
  isLive: boolean;
  team: Team;
};

export const BoxscoreTable = ({ isLive, team }: BoxscoreProps) => {
  // get color values from the current color mode
  // const bg = useColorModeValue("white", "gray.600");
  // const borderColor = useColorModeValue("gray.100", "gray.700");

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
    <div className="w-full overflow-x-auto">
      <div className="w-full flex flex-col gap-2">
        <span className="font-bold tracking-widest">
          {team.teamName.toUpperCase()}
        </span>
        <Table className="w-full rounded-md bg-white dark:bg-gray-600 font-mono">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[190px] w-[350px]">Name</TableHead>
              <TableHead>Min</TableHead>
              <TableHead>FG</TableHead>
              <TableHead>3PT</TableHead>
              <TableHead>FT</TableHead>
              <TableHead>Reb</TableHead>
              <TableHead>Ast</TableHead>
              <TableHead>Pts</TableHead>
              <TableHead>+/-</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {team.players.map((player, i) => (
              <TableRow
                className={`${i === 4 ? "border-b-[4px]" : "border-b-[1.5px]"} border-gray-100 dark:border-gray-700`}
                key={player.personId}
              >
                <TableCell className="hidden sm:block min-w-[190px] max-w-[350px]">
                  {player.firstName} {player.familyName}{" "}
                  {isLive && player.oncourt === "1" && "○"}
                </TableCell>
                <TableCell
                  className={`text-sm sm:hidden min-w-[190px] max-w-[350px]`}
                >
                  {player.firstName[0]} {player.familyName}{" "}
                  {isLive && player.oncourt === "1" && "○"}
                </TableCell>
                <TableCell>
                  {formatMinutes(player.statistics.minutesCalculated)}
                </TableCell>
                <TableCell>
                  {player.statistics.fieldGoalsMade}-
                  {player.statistics.fieldGoalsAttempted}{" "}
                </TableCell>
                <TableCell>
                  {player.statistics.threePointersMade}-
                  {player.statistics.threePointersAttempted}{" "}
                </TableCell>
                <TableCell>
                  {player.statistics.freeThrowsMade}-
                  {player.statistics.freeThrowsAttempted}{" "}
                </TableCell>
                <TableCell>{player.statistics.reboundsTotal}</TableCell>
                <TableCell>{player.statistics.assists}</TableCell>
                <TableCell>{player.statistics.points}</TableCell>
                <TableCell>
                  {formatPlusMinus(player.statistics.plusMinusPoints)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
