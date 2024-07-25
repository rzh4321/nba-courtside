'use server';
import { API } from "@/constants";

export default async function getBoxScore(gameId: string) {
    const res = await fetch(`${API.DETAILS_URL}/boxscore/boxscore_${gameId}.json`,
    {
      cache: "no-store",
    });
    if (res.ok) {
        const data = await res.json();
        return data.game;
    }
    // game hasnt started yet, has no box score
    return JSON.stringify({
        notStarted: true,
    })
}