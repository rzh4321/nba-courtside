import { NextRequest } from 'next/server'; 
import { getBoxscore } from '@/service';
import { NextResponse } from 'next/server';

export async function GET(req : NextRequest, context: {params: {gameId: string}}) {
    const data = await getBoxscore(context.params.gameId);
    return NextResponse.json(data);
}