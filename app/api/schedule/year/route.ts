import { getLeagueSchedule } from "@/service";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  const data = await getLeagueSchedule();
  return NextResponse.json(data);
}
