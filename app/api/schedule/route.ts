import type { NextApiRequest, NextApiResponse } from 'next'
import { getLeagueSchedule } from '@/service';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getLeagueSchedule();
    return NextResponse.json(data);
}