import type { GameBettingInfo } from "@/types";
import { useState, useEffect } from "react";

export default function useGameBettingInfo(gameId: string, homeTeam: string, awayTeam: string, ) {
    const [gameBettingInfo, setGameBettingInfo] = useState<GameBettingInfo | null>();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tryGameId = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/games/${gameId}`);
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to fetch game');
                }
                const data = await res.json();
                setGameBettingInfo(data);
                setError(null);

            } catch (err) {
                setError((err as any).message);
                setGameBettingInfo(null);
            } finally {
                setLoading(false);
            }

        }
        if (homeTeam && awayTeam)
            tryGameId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [homeTeam, awayTeam]);

    return {gameBettingInfo, loading, error}
}