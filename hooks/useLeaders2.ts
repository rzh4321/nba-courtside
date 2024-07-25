import { API } from "@/constants";
import flatten from "lodash/flatten";
import useSWR from "swr";
import { nbaTeamAcronyms } from "@/utils/mappers";
import type { Team, PlayerStatistics } from "@/types";

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

export default function useLeaders(gameIds: string[], refresh=false) {
    const {data, isLoading, error} = useSWR(`${API.DETAILS_URL}/boxscore/boxscore_${gameId}.json`, async(url) => {
        fetch(url, {
            cache: 'no-store',
        })
    });
    if (!error && data) {
        const homeTeam = (data as { game: { homeTeam: any } }).game.homeTeam.teamTricode;
        const awayTeam = (data as { game: { awayTeam: any } }).game.awayTeam.teamTricode;


    }
    
}