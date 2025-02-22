import flatten from "lodash/flatten";
import useSWR from "swr";
import type { Team, PlayerStatistics } from "@/types";
import getBoxScore from "@/actions/getBoxScore";
import { useMemo } from "react";

function getLeaders(teams: (Team | null)[], category: keyof PlayerStatistics) {
  const validTeams = teams.filter((team) => team != null);
  const players = flatten(
    // create an array of player objects
    validTeams.map((team) => [
      ...team.players.map((p) => ({
        ...p,
        team: team.teamTricode,
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

export default function useLeaders(
  gameIds: string[] | undefined,
  refresh = false,
) {
  const { data, isLoading, error } = useSWR(
    gameIds ? gameIds : null,
    async () => {
      if (gameIds!.length === 0) {
        return undefined;
      }
      const requests = gameIds!.map(async (id) => {
        let data;
        try {
          const data = await getBoxScore(id);
          return data;
        } catch (e) {
          console.log("ERROR: ", e, "ID WAS ", id, " DATA WAS : ", data);
        }
      });
      // return an array of boxscore data
      return await Promise.all(requests);
    },
    {
      refreshInterval: refresh ? 1000 * 30 : undefined,
      refreshWhenHidden: true,
      refreshWhenOffline: true,
    },
  );

  // data is an array of games. Extract all top leaders
  const teams = data?.flatMap((game) =>
    game ? [game.awayTeam, game.homeTeam] : [null],
  );
  // only re-calculate leaders if data changes (if at least one game is still live)
  const pointLeaders = useMemo(() => getLeaders(teams || [], "points"), [data]);
  const assistLeaders = useMemo(
    () => getLeaders(teams || [], "assists"),
    [data],
  );
  const reboundLeaders = useMemo(
    () => getLeaders(teams || [], "reboundsTotal"),
    [data],
  );
  const stealLeaders = useMemo(() => getLeaders(teams || [], "steals"), [data]);
  const blockLeaders = useMemo(() => getLeaders(teams || [], "blocks"), [data]);

  return {
    pointLeaders: pointLeaders.slice(0, 4),
    assistLeaders: assistLeaders.slice(0, 4),
    reboundLeaders: reboundLeaders.slice(0, 4),
    stealLeaders: stealLeaders.slice(0, 4),
    blockLeaders: blockLeaders.slice(0, 4),
    isLoading,
  };
}
