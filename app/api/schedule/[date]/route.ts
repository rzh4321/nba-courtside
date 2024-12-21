import { parseGames } from "@/utils/mappers";
import { API } from "@/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { date: string } },
) {
  const date = context.params.date;
  const res = await fetch(
    `${API.BASE_URL}/scoreboardv3&GameDate=${date}&LeagueID=00`,
    {
      cache: "no-store",
    },
  );

  const data = await res.json();
  const parsedData = parseGames(data);
  return NextResponse.json(parsedData);
}
