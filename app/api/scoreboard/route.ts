import { getScoreboard } from '@/service';
import { NextResponse, NextRequest } from 'next/server';

const scoreboardUrl = `https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json`;



export async function GET(req: NextRequest) {
    const res = await fetch(scoreboardUrl, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
}