import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Conference } from "@/utils/mappers";
import Image from "next/image";

type StandingTableProps = {
  label: string;
  conference: Conference;
};

export default function StandingTable({
  label,
  conference,
}: StandingTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full bg-white dark:bg-gray-600 rounded-md font-mono">
        <TableHeader>
          <TableRow>
            <TableHead>
              <span className="font-semibold tracking-widest">
                {label.toUpperCase()}
              </span>
            </TableHead>
            <TableHead className="">W - L</TableHead>
            <TableHead>PCT</TableHead>
            <TableHead>GB</TableHead>
            <TableHead>HOME</TableHead>
            <TableHead>AWAY</TableHead>
            <TableHead>L10</TableHead>
            <TableHead>STRK</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conference.map((team, i) => (
            <TableRow
              className={`font-bold ${i === 5 || i === 9 ? "border-b-[2px] border-gray-500 dark:border-gray-400" : "border-b-[1.5px] border-gray-100 dark:border-gray-700"}`}
              key={team.id}
            >
              <TableCell className="min-w-[200px] w-[305px]">
                <div className="flex gap-5 items-center">
                  <span className="min-w-[17px]">{i + 1}</span>
                  <Image
                    src={`https://cdn.nba.com/logos/nba/${team.id}/primary/L/logo.svg`}
                    width={30}
                    height={30}
                    alt={team.name}
                  />
                  <span>{team.name}</span>
                </div>
              </TableCell>
              <TableCell className="min-w-[95px]">
                {team.win} - {team.loss}
              </TableCell>
              <TableCell>{team.percentage}%</TableCell>
              <TableCell>{team.gamesBehind}</TableCell>
              <TableCell className="min-w-[75px]">{team.homeRecord}</TableCell>
              <TableCell className="min-w-[75px]">{team.awayRecord}</TableCell>
              <TableCell>{team.lastTenRecord}</TableCell>
              <TableCell className="text-center">{team.streak}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
