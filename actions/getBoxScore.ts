"use server";
import { API } from "@/constants";
import type { Boxscore } from "@/types";


export default async function getBoxScore(gameId: string, retries = 3) {
      const res = await fetch(
        `${API.DETAILS_URL}/boxscore/boxscore_${gameId}.json`,
        {
          cache: "no-store",
        }
      );

      

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error(`Expected JSON but got ${contentType}`);
      }

      const data = await res.json();

      return data.game as Boxscore;
}