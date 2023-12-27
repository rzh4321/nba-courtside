import useSWR from "swr";
import { BoxscoreResponse } from "@/types";
import flatten from "lodash/flatten";
import { useMemo } from "react";

type Statistics =
  BoxscoreResponse["game"]["homeTeam"]["players"][number]["statistics"];

function getLeaders(boxscores: BoxscoreResponse[], category: keyof Statistics) {
  const players = flatten(
    // create an array of player objects
    boxscores.map((boxscore) => [
      ...boxscore.game.homeTeam.players.map((p) => ({
        ...p,
        team: boxscore.game.homeTeam.teamTricode,
      })),
      ...boxscore.game.awayTeam.players.map((p) => ({
        ...p,
        team: boxscore.game.awayTeam.teamTricode,
      })),
    ]),
  );

  // sort players by box score stats
  const sorted = players.sort((a, b) => {
    if (a.statistics[category] > b.statistics[category]) {
      return -1;
    } else if (a.statistics[category] < b.statistics[category]) {
      return 1;
    } else {
      return 0;
    }
  });

  return sorted;
}

// refresh data if at least one game is still live
// gameIds is gameIds of all played/playings games of last game date
export function useLeaders(gameIds: string[], refresh = false) {
  const { data } = useSWR(
    gameIds,
    async () => {
      if (gameIds.length === 0) {
        return undefined;
      }
      const requests = gameIds.map(async (id) => {
        const res = await fetch(`/api/boxscore/${id}`);
        return await res.json();
      });
      // return an array of boxscore data
      return await Promise.all(requests);
    },
    {
      refreshInterval: refresh ? 1000 * 30 : undefined,
      refreshWhenHidden: true,
      refreshWhenOffline: true
    },
  );

  // only re-calculate leaders if data changes (if at least one game is still live)
  const pointLeaders = useMemo(() => getLeaders(data || [], "points"), [data]);
  const assistLeaders = useMemo(
    () => getLeaders(data || [], "assists"),
    [data],
  );
  const reboundLeaders = useMemo(
    () => getLeaders(data || [], "reboundsTotal"),
    [data],
  );

  return {
    pointLeaders: pointLeaders.slice(0, 4),
    assistLeaders: assistLeaders.slice(0, 4),
    reboundLeaders: reboundLeaders.slice(0, 4),
  };
}
