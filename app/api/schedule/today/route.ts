import { API } from "@/constants";
import { parseGames } from "@/utils/mappers";

export async function GET() {
  const res = await fetch(
    `${API.DETAILS_URL}/scoreboard/todaysScoreboard_00.json`,
    { next: { revalidate: 10 } },
  );

  const data = await res.json();
  const parsedGames = parseGames(data);
  return Response.json(parsedGames);
}
