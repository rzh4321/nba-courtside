import { API } from "@/constants";
import { parseGames } from "@/utils/mappers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || 'today';
  
  if (date === 'today') {
    // Add a unique timestamp to completely bypass any caching for the NBA API
    const noCacheTimestamp = Date.now();
    const apiUrl = `${API.DETAILS_URL}/scoreboard/todaysScoreboard_00.json?nocache=${noCacheTimestamp}`;
    
    try {
      // Use fetch with explicit no-cache options
      const res = await fetch(apiUrl, {
        cache: "no-store",
      });
      
      if (!res.ok) {
        throw new Error(`NBA API responded with status: ${res.status}`);
      }
      
      const data = await res.json();
      const parsedGames = parseGames(data);
      
      // Set cache prevention headers on response
      return new Response(JSON.stringify(parsedGames));
    } catch (error) {
      console.error("Error fetching NBA data:", error);
      return Response.json({ error: "Failed to fetch NBA data" }, { status: 500 });
    }
  } 
  else {
    // Historical data can be cached
    const apiUrl = `${API.BASE_URL}/scoreboardv3&GameDate=${date}&LeagueID=00`;
    
    try {
      const res = await fetch(apiUrl, { 
        next: { revalidate: 86400 } // 24 hours
      });
      
      if (!res.ok) {
        throw new Error(`NBA API responded with status: ${res.status}`);
      }
      
      const data = await res.json();
      const parsedGames = parseGames(data);
      return Response.json(parsedGames);
    } catch (error) {
      console.error("Error fetching historical NBA data:", error);
      return Response.json({ error: "Failed to fetch NBA data" }, { status: 500 });
    }
  }
}