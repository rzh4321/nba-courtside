import { getScoreboard } from '@/service';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const data = await getScoreboard();
    return NextResponse.json(data);
}