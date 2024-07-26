import type { Boxscore } from "@/types";
import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import TeamStatistic from "./TeamStatistic";
import { teamColors } from "@/theme";

export default function TeamStats({ boxscore }: { boxscore: Boxscore }) {
  return (
    <VStack gap={5}>
      <HStack w={"full"} justifyContent={"space-between"}>
        <Image
          src={`https://cdn.nba.com/logos/nba/${boxscore.awayTeam.teamId}/primary/L/logo.svg`}
          width={30}
          height={30}
          alt={boxscore.awayTeam.teamName}
        />
        <Text fontWeight={800} fontSize={20}>
          Team Stats
        </Text>
        <Image
          src={`https://cdn.nba.com/logos/nba/${boxscore.homeTeam.teamId}/primary/L/logo.svg`}
          width={30}
          height={30}
          alt={boxscore.homeTeam.teamName}
        />
      </HStack>
      <TeamStatistic
        label="Field Goals"
        leftLabel={`${boxscore.awayTeam.statistics.fieldGoalsMade}/${boxscore.awayTeam.statistics.fieldGoalsAttempted} (${Math.round((100 * boxscore.awayTeam.statistics.fieldGoalsMade) / boxscore.awayTeam.statistics.fieldGoalsAttempted)}%)`}
        rightLabel={`${boxscore.homeTeam.statistics.fieldGoalsMade}/${boxscore.homeTeam.statistics.fieldGoalsAttempted} (${Math.round((100 * boxscore.homeTeam.statistics.fieldGoalsMade) / boxscore.homeTeam.statistics.fieldGoalsAttempted)}%)`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="3 Pointers"
        leftLabel={`${boxscore.awayTeam.statistics.threePointersMade}/${boxscore.awayTeam.statistics.threePointersAttempted} (${Math.round((100 * boxscore.awayTeam.statistics.threePointersMade) / boxscore.awayTeam.statistics.threePointersAttempted)}%)`}
        rightLabel={`${boxscore.homeTeam.statistics.threePointersMade}/${boxscore.homeTeam.statistics.threePointersAttempted} (${Math.round((100 * boxscore.homeTeam.statistics.threePointersMade) / boxscore.homeTeam.statistics.threePointersAttempted)}%)`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Free Throws"
        leftLabel={`${boxscore.awayTeam.statistics.freeThrowsMade}/${boxscore.awayTeam.statistics.freeThrowsAttempted} (${Math.round((100 * boxscore.awayTeam.statistics.freeThrowsMade) / boxscore.awayTeam.statistics.freeThrowsAttempted)}%)`}
        rightLabel={`${boxscore.homeTeam.statistics.freeThrowsMade}/${boxscore.homeTeam.statistics.freeThrowsAttempted} (${Math.round((100 * boxscore.homeTeam.statistics.freeThrowsMade) / boxscore.homeTeam.statistics.freeThrowsAttempted)}%)`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Rebounds"
        leftLabel={`${boxscore.awayTeam.statistics.reboundsTotal}`}
        rightLabel={`${boxscore.homeTeam.statistics.reboundsTotal}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Offensive Rebounds"
        leftLabel={`${boxscore.awayTeam.statistics.reboundsOffensive}`}
        rightLabel={`${boxscore.homeTeam.statistics.reboundsOffensive}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Assists"
        leftLabel={`${boxscore.awayTeam.statistics.assists}`}
        rightLabel={`${boxscore.homeTeam.statistics.assists}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Steals"
        leftLabel={`${boxscore.awayTeam.statistics.steals}`}
        rightLabel={`${boxscore.homeTeam.statistics.steals}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Blocks"
        leftLabel={`${boxscore.awayTeam.statistics.blocks}`}
        rightLabel={`${boxscore.homeTeam.statistics.blocks}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Rebounds"
        leftLabel={`${boxscore.awayTeam.statistics.reboundsTotal}`}
        rightLabel={`${boxscore.homeTeam.statistics.reboundsTotal}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Turnovers"
        leftLabel={`${boxscore.awayTeam.statistics.turnovers}`}
        rightLabel={`${boxscore.homeTeam.statistics.turnovers}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Points in the Paint"
        leftLabel={`${boxscore.awayTeam.statistics.pointsInThePaint}`}
        rightLabel={`${boxscore.homeTeam.statistics.pointsInThePaint}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Second Chance Points"
        leftLabel={`${boxscore.awayTeam.statistics.pointsSecondChance}`}
        rightLabel={`${boxscore.homeTeam.statistics.pointsSecondChance}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Fast Break Points"
        leftLabel={`${boxscore.awayTeam.statistics.pointsFastBreak}`}
        rightLabel={`${boxscore.homeTeam.statistics.pointsFastBreak}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Points Off Turnovers"
        leftLabel={`${boxscore.awayTeam.statistics.pointsFromTurnovers}`}
        rightLabel={`${boxscore.homeTeam.statistics.pointsFromTurnovers}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Biggest Lead"
        leftLabel={`${boxscore.awayTeam.statistics.biggestLead}`}
        rightLabel={`${boxscore.homeTeam.statistics.biggestLead}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Fouls (Pers.)"
        leftLabel={`${boxscore.awayTeam.statistics.foulsPersonal}`}
        rightLabel={`${boxscore.homeTeam.statistics.foulsPersonal}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
      <TeamStatistic
        label="Fouls (Tech.)"
        leftLabel={`${boxscore.awayTeam.statistics.foulsTechnical}`}
        rightLabel={`${boxscore.homeTeam.statistics.foulsTechnical}`}
        leftColor={teamColors[boxscore.awayTeam.teamTricode]}
        rightColor={teamColors[boxscore.homeTeam.teamTricode]}
      />
    </VStack>
  );
}
