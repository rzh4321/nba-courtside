import type { PlayerStatistics } from "@/types";
import Image from "next/image";
import { useState } from "react";
import useLeaders from "@/hooks/useLeaders";
import { teamColors } from "@/theme";

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
  const teamColor = teamColors[player.team];
  return (
    <div className="performer-card max-w-[216px] min-w-[150px] w-[216px] relative z-0">
      <div
        style={{ backgroundColor: teamColor }}
        className={`w-full h-4/5 absolute rounded-t-lg bottom-[4px] z-[-1]`}
      />
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
      <div className="bg-gray-700 dark:bg-gray-900 px-4 py-2 rounded-b-lg">
        <span className="font-semibold text-white">
          {player.statistics[category]}{" "}
          <span className="text-gray-300 dark:text-gray-400">
            {categoryDisplay(category)}
          </span>
        </span>
        <div className="text-white player-name font-montserrat">
          {player.firstName}{" "}
          {player.familyName.length >= 12
            ? player.familyName.slice(0, 1) + "."
            : player.familyName}
        </div>
      </div>
    </div>
  );
};
