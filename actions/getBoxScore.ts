"use server";
import { API } from "@/constants";
import type { Boxscore } from "@/types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function getBoxScore(gameId: string, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(
        `${API.DETAILS_URL}/boxscore/boxscore_${gameId}.json`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        console.error(`Attempt ${attempt} failed for gameID ${gameId} in getBoxscore bc of status code`);
      
        if (attempt === retries) {
          throw `Game id ${gameId} kept returning error code, alr tried 3 times`;
        }
      
        await delay(Math.min(1000 * Math.pow(2, attempt - 1), 5000));
      }

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error(`Expected JSON but got ${contentType}`);
      }

      const data = await res.json();

      return data.game as Boxscore;
    } catch (error) {
      console.error(`Attempt ${attempt} failed for gameID ${gameId} in getBoxscore:`, error);
      
      if (attempt === retries) {
        throw error;
      }
      
      await delay(Math.min(1000 * Math.pow(2, attempt - 1), 5000));
    }
  }
}