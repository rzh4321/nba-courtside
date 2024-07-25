'use server';
import { parseGames } from "@/utils/mappers";
import { API } from "@/constants";

export default async function getScoreboards(date? : string) {
    if (date) {
        const res = await fetch(
            `${API.BASE_URL}/scoreboardv3&GameDate=${date}&LeagueID=00`,
            {
              cache: "no-store",
            },
          );
        
          const data = await res.json();
          return parseGames(data);
    } else {
        const res = await fetch(
            `${API.DETAILS_URL}/scoreboard/todaysScoreboard_00.json`,
          );
        
          const data = await res.json();
          return parseGames(data);
    }
}