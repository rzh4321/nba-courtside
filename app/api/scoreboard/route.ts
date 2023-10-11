import type { NextApiRequest, NextApiResponse } from 'next'
import { getScoreboard } from '@/service';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getScoreboard();
    return NextResponse.json(data);
}