import { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { bettingService } from "@/bettingService";
import type { GameBettingInfos, GameBettingInfo } from "@/types";

export default function useTodaysOdds() {
  const [todaysOdds, setTodaysOdds] = useState<GameBettingInfos>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { lastMessage, isConnected } = useWebSocket();

  const sortData = (
    data: Record<string, GameBettingInfo[]>,
  ): [string, GameBettingInfo[]][] => {
    const getDateFromLabel = (label: string): Date | null => {
      if (label === "Today") return new Date();
      if (label === "Tomorrow") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      }

      // Parse string format "April 22nd" to Date object
      const withSuffixRemoved = label.replace(/(\d+)(st|nd|rd|th)/, "$1");
      const fullDateStr = `${withSuffixRemoved}, ${new Date().getFullYear()}`;
      const parsedDate = new Date(fullDateStr);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    };

    return Object.entries(data).sort(([keyA], [keyB]) => {
      const priority = { Today: 0, Tomorrow: 1 };

      const isAInPriority = keyA in priority;
      const isBInPriority = keyB in priority;

      if (isAInPriority && isBInPriority) {
        return (
          priority[keyA as keyof typeof priority] -
          priority[keyB as keyof typeof priority]
        );
      }

      if (isAInPriority) return -1;
      if (isBInPriority) return 1;

      const dateA = getDateFromLabel(keyA);
      const dateB = getDateFromLabel(keyB);

      if (dateA && dateB) {
        return dateA.getTime() - dateB.getTime();
      }

      return 0; // fallback to no change if parsing fails
    });
  };

  const fetchTodaysOdds = async () => {
    try {
      let data;
      try {
        console.log("GETTING TODAYS BETTING ODDS FOR HOME PAGE...");
        data = await bettingService.getTodaysOdds();
        const sortedEntries = sortData(data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  return { todaysOdds, loading, error, isConnected };
}
