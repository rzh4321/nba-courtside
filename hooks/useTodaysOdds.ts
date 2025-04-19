import { useState, useEffect, useCallback } from "react";
import { useWebSocket } from "@/contexts/WebSocketContext";
import { bettingService } from "@/bettingService";
import type { GameBettingInfos, GameBettingInfo } from "@/types";

export default function useTodaysOdds() {
  const [todaysOdds, setTodaysOdds] = useState<GameBettingInfos | null>(null);
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
  //   useEffect(() => {
  //     if (lastMessage) {
  //       console.log("LAST MESSAGE IS ", lastMessage);
  //       const {
  //         type,
  //         gameId: msgGameId,
  //         homeTeam: msgHomeTeam,
  //         awayTeam: msgAwayTeam,
  //         gameDate: msgGameDate,
  //         data: gameData,
  //       } = lastMessage;

  //       const isRelevantUpdate =
  //         (type === "ODDS_UPDATE" && msgGameId === gameId) ||
  //         (type === "ODDS_UPDATE_BY_TEAMS" &&
  //           msgHomeTeam === homeTeam &&
  //           msgAwayTeam === awayTeam &&
  //           msgGameDate === gameDate);

  //       if (isRelevantUpdate) {
  //         console.log(
  //           "LAST MESSAGE FROM SOCKET MATCHES THIS GAME, UPDATED BETTING INFO :)",
  //         );
  //         // Directly use the data from the WebSocket message
  //         setGameBettingInfo(gameData);
  //         setError(null);

  //         // If we got data but no gameId is set, set it
  //         if (gameData && !gameData.gameId) {
  //           console.log("GAMEID IN DB WAS NULL, SETTING IT NOW");
  //           bettingService
  //             .setGameId(homeTeam, awayTeam, gameDate!, gameId)
  //             .catch((error) => console.error("Error setting game ID:", error));
  //         }
  //       }
  //     }
  //   }, [lastMessage, gameId, homeTeam, awayTeam, gameDate]);

  return { todaysOdds, loading, error, isConnected };
}
