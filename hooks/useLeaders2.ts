import { API } from "@/constants";
import flatten from "lodash/flatten";
import useSWR from "swr";
import { nbaTeamAcronyms } from "@/utils/mappers";
import type { Team, PlayerStatistics } from "@/types";
import getBoxScore from "@/actions/getBoxScore";

function getLeaders(teams: Team[], category: keyof PlayerStatistics) {
    const players = flatten(
      // create an array of player objects
      teams.map((team) => [
        ...team.players.map((p) => ({
          ...p,
          team: team.teamTricode,
        })),
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

export default function useLeaders(gameIds: string[] | undefined, refresh=false) {
    const { data, isLoading, error } = useSWR(
        gameIds ? gameIds : null,
        async () => {
          if (gameIds!.length === 0) {
            return undefined;
          }
          const requests = gameIds!.map(async (id) => {
            return await getBoxScore(id);
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
        console.log('LEADER DATA IS ', data);
    
}