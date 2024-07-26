'use server';
import { API } from "@/constants";
import type { Boxscore } from "@/types";

export default async function getBoxScore(gameId: string) {
    const res = await fetch(`${API.DETAILS_URL}/boxscore/boxscore_${gameId}.json`,
    {
      cache: "no-store",
    });
    
        const data = await res.json();
        return data.game as Boxscore;

}