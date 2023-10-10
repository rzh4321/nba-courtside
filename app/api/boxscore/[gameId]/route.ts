import type { NextApiRequest, NextApiResponse } from 'next'
import { getBoxscore } from '@/service';
import { NextResponse } from 'next/server';

export async function GET(req : NextApiRequest, context: {params: {gameId: string}}) {
    const data = await getBoxscore(context.params.gameId);
    console.log('IN API :', data);
    return NextResponse.json(data);
}