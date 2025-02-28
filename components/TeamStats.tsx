import type { Boxscore } from "@/types";
import Image from "next/image";
import TeamStatistic from "./TeamStatistic";
import { teamColors, colorsTooSimilar } from "@/theme";

export default function TeamStats({ boxscore }: { boxscore: Boxscore }) {
  return (
    <div className="flex flex-col gap-5 mb-7">
      <div className="flex w-full justify-between">
        <Image
          src={`https://cdn.nba.com/logos/nba/${boxscore.awayTeam.teamId}/primary/L/logo.svg`}
          width={30}
          height={30}
          alt={boxscore.awayTeam.teamName}
        />
        <span className="font-extrabold text-xl">Team Stats</span>
        <Image
          src={`https://cdn.nba.com/logos/nba/${boxscore.homeTeam.teamId}/primary/L/logo.svg`}
          width={30}
          height={30}
          alt={boxscore.homeTeam.teamName}
        />
      </div>
      <TeamStatistic
        label="Field Goals"
        leftLabel={`${boxscore.awayTeam.statistics.fieldGoalsMade}/${boxscore.awayTeam.statistics.fieldGoalsAttempted} (${Math.round((100 * boxscore.awayTeam.statistics.fieldGoalsMade) / boxscore.awayTeam.statistics.fieldGoalsAttempted)}%)`}
        rightLabel={`${boxscore.homeTeam.statistics.fieldGoalsMade}/${boxscore.homeTeam.statistics.fieldGoalsAttempted} (${Math.round((100 * boxscore.homeTeam.statistics.fieldGoalsMade) / boxscore.homeTeam.statistics.fieldGoalsAttempted)}%)`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="3 Pointers"
        leftLabel={`${boxscore.awayTeam.statistics.threePointersMade}/${boxscore.awayTeam.statistics.threePointersAttempted} (${Math.round((100 * boxscore.awayTeam.statistics.threePointersMade) / boxscore.awayTeam.statistics.threePointersAttempted)}%)`}
        rightLabel={`${boxscore.homeTeam.statistics.threePointersMade}/${boxscore.homeTeam.statistics.threePointersAttempted} (${Math.round((100 * boxscore.homeTeam.statistics.threePointersMade) / boxscore.homeTeam.statistics.threePointersAttempted)}%)`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Free Throws"
        leftLabel={`${boxscore.awayTeam.statistics.freeThrowsMade}/${boxscore.awayTeam.statistics.freeThrowsAttempted} (${Math.round((100 * boxscore.awayTeam.statistics.freeThrowsMade) / (boxscore.awayTeam.statistics.freeThrowsAttempted || 1))}%)`}
        rightLabel={`${boxscore.homeTeam.statistics.freeThrowsMade}/${boxscore.homeTeam.statistics.freeThrowsAttempted} (${Math.round((100 * boxscore.homeTeam.statistics.freeThrowsMade) / (boxscore.homeTeam.statistics.freeThrowsAttempted || 1))}%)`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Rebounds"
        leftLabel={`${boxscore.awayTeam.statistics.reboundsTotal}`}
        rightLabel={`${boxscore.homeTeam.statistics.reboundsTotal}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Offensive Rebounds"
        leftLabel={`${boxscore.awayTeam.statistics.reboundsOffensive}`}
        rightLabel={`${boxscore.homeTeam.statistics.reboundsOffensive}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Assists"
        leftLabel={`${boxscore.awayTeam.statistics.assists}`}
        rightLabel={`${boxscore.homeTeam.statistics.assists}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Steals"
        leftLabel={`${boxscore.awayTeam.statistics.steals}`}
        rightLabel={`${boxscore.homeTeam.statistics.steals}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Blocks"
        leftLabel={`${boxscore.awayTeam.statistics.blocks}`}
        rightLabel={`${boxscore.homeTeam.statistics.blocks}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Rebounds"
        leftLabel={`${boxscore.awayTeam.statistics.reboundsTotal}`}
        rightLabel={`${boxscore.homeTeam.statistics.reboundsTotal}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Turnovers"
        leftLabel={`${boxscore.awayTeam.statistics.turnovers}`}
        rightLabel={`${boxscore.homeTeam.statistics.turnovers}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Points in the Paint"
        leftLabel={`${boxscore.awayTeam.statistics.pointsInThePaint}`}
        rightLabel={`${boxscore.homeTeam.statistics.pointsInThePaint}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Second Chance Points"
        leftLabel={`${boxscore.awayTeam.statistics.pointsSecondChance}`}
        rightLabel={`${boxscore.homeTeam.statistics.pointsSecondChance}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Fast Break Points"
        leftLabel={`${boxscore.awayTeam.statistics.pointsFastBreak}`}
        rightLabel={`${boxscore.homeTeam.statistics.pointsFastBreak}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Points Off Turnovers"
        leftLabel={`${boxscore.awayTeam.statistics.pointsFromTurnovers}`}
        rightLabel={`${boxscore.homeTeam.statistics.pointsFromTurnovers}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Biggest Lead"
        leftLabel={`${boxscore.awayTeam.statistics.biggestLead}`}
        rightLabel={`${boxscore.homeTeam.statistics.biggestLead}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Fouls (Pers.)"
        leftLabel={`${boxscore.awayTeam.statistics.foulsPersonal}`}
        rightLabel={`${boxscore.homeTeam.statistics.foulsPersonal}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
      <TeamStatistic
        label="Fouls (Tech.)"
        leftLabel={`${boxscore.awayTeam.statistics.foulsTechnical}`}
        rightLabel={`${boxscore.homeTeam.statistics.foulsTechnical}`}
        leftColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#1F3CFA"
            : teamColors[boxscore.awayTeam.teamTricode]
        }
        rightColor={
          colorsTooSimilar(
            boxscore.awayTeam.teamTricode,
            boxscore.homeTeam.teamTricode,
          )
            ? "#CBF717"
            : teamColors[boxscore.homeTeam.teamTricode]
        }
      />
    </div>
  );
}
