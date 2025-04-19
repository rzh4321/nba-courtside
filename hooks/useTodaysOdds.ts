import { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { bettingService } from "@/bettingService";
import type { GameBettingInfos, GameBettingInfo } from "@/types";

export default function useTodaysOdds() {
  const [todaysOdds, setTodaysOdds] = useState<GameBettingInfos>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { lastMessage, isConnected } = useWebSocket();

  const fetchTodaysOdds = async () => {
    try {
      let data;
      try {
        console.log("GETTING TODAYS BETTING ODDS FOR HOME PAGE...");
        data = await bettingService.getTodaysOdds();
        const entries = Object.entries(data).sort(
          ([dateA], [dateB]) =>
            new Date(dateA).getTime() - new Date(dateB).getTime(),
        );
        const sortedEntries = entries.map(([key, games]) => [
          key,
          [...(games as GameBettingInfo[])].sort((a, b) => a.id - b.id),
        ]);
        setTodaysOdds(sortedEntries as GameBettingInfos);
      } catch (error: any) {
        setError(error.message);
      }
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTodaysOdds();
  }, []);

  // Handle WebSocket updates
  useEffect(() => {
    if (lastMessage) {
      console.log("ON TODAY PAGE. LAST MESSAGE IS ", lastMessage);
      const {
        type,
        gameId: msgGameId,
        homeTeam: msgHomeTeam,
        awayTeam: msgAwayTeam,
        id: rowId,

        data: gameData,
      } = lastMessage;

      const newBettingOdds = todaysOdds.map(([dateStr, gamesArr]) => {
        const updatedGamesArr = gamesArr.map((game) => {
          const isRelevantUpdate =
            (type === "ODDS_UPDATE" && msgGameId === game.gameId) ||
            (type === "ODDS_UPDATE_BY_TEAMS" &&
              msgHomeTeam === game.homeTeam &&
              msgAwayTeam === game.awayTeam &&
              rowId === game.id);
          return isRelevantUpdate ? gameData : game;
        });
        return [dateStr, updatedGamesArr] as [string, GameBettingInfo[]];
      });
      setTodaysOdds(newBettingOdds);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [lastMessage]);

  return { todaysOdds, loading, error, isConnected };
}
