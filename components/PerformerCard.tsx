import type { PlayerStatistics } from "@/types";
import { AspectRatio, Box, Text, useColorModeValue } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import useLeaders from "@/hooks/useLeaders";

function categoryDisplay(category: string) {
  switch (category) {
    case "points":
      return "PTS";
    case "assists":
      return "AST";
    case "reboundsTotal":
      return "REB";
    case "steals":
      return "STL";
    case "blocks":
      return "BLK";
    default:
      return category;
  }
}

export type PerformerCardProps = {
  player: ReturnType<typeof useLeaders>["pointLeaders"][0];
  category: keyof PlayerStatistics;
};

export const PerformerCard = ({ player, category }: PerformerCardProps) => {
  const [imageUrl, setImageUrl] = useState(
    `https://cdn.nba.com/headshots/nba/latest/1040x760/${player.personId}.png`,
  );
  const cardColor = useColorModeValue("gray.700", "gray.900");
  const textColor = useColorModeValue("gray.300", "gray.400");

  return (
    <Box
      maxW={"216px"}
      minW={"150px"}
      w={"216px"}
      position={"relative"}
      className="performer-card"
      zIndex={0}
    >
      {/* a Box for player team's colors */}
      <Box
        bg={player.team}
        w={"full"}
        h={"80%"}
        position={"absolute"}
        roundedTop={"lg"}
        bottom={4}
        zIndex={-1}
      />
      <AspectRatio ratio={1040 / 760}>
        <Image
          src={imageUrl}
          alt={player.familyName}
          height={216}
          width={216}
          onError={() =>
            setImageUrl(
              "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png",
            )
          }
        />
      </AspectRatio>
      {/* display player stats and name */}
      <Box bg={cardColor} px={4} py={2} roundedBottom={"lg"}>
        <Text fontWeight={"semibold"} color={"white"}>
          {player.statistics[category]}{" "}
          <Box as={"span"} color={textColor}>
            {categoryDisplay(category)}
          </Box>
        </Text>
        <Text color={"white"} className="player-name">
          {player.firstName} {player.familyName}
        </Text>
      </Box>
    </Box>
  );
};
