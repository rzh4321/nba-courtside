import { NextRequest } from "next/server";
import { getBoxscore } from "@/service";
import { NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { gameId: string } },
) {
  try {
    const data = await getBoxscore(context.params.gameId);
    return NextResponse.json(data);
  } catch {
    // game has not started yet
    return NextResponse.json(false);
  }
}
