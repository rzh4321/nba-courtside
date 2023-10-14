import { getScoreboard } from '@/service';
import { NextResponse, NextRequest } from 'next/server';

const host = 'https://cdn.nba.com';
const scoreboardUrl = `${host}/static/json/liveData/scoreboard/todaysScoreboard_00.json`;



export async function GET(req: NextRequest) {
    const res = await fetch(scoreboardUrl, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
}