import type { NextApiRequest, NextApiResponse } from 'next'
import { getBoxscore } from '@/service';
import { NextResponse } from 'next/server';

export async function GET(req : NextApiRequest, context: {params: {gameId: string}}) {
    const data = await getBoxscore(context.params.gameId);
    return NextResponse.json(data);
}