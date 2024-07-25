import { API } from "@/constants";
import useSWR from "swr";
import { nbaTeamAcronyms } from "@/utils/mappers";

export default function useLeaders(gameId: string) {
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