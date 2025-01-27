import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { bettingService } from '@/bettingService';
import type { GameBettingInfo } from '@/types';

export default function useGameBettingInfo(
    gameId: string,
    homeTeam: string,
    awayTeam: string,
    gameDate: string | undefined
) {
    const [gameBettingInfo, setGameBettingInfo] = useState<GameBettingInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { lastMessage, isConnected } = useWebSocket();

    const fetchGameData = useCallback(async () => {
        try {
            let data;
            try {
                console.log('FIRST TRYING WITH GAMID....')
                // First try with gameId
                data = await bettingService.getGameByGameId(gameId);
            } catch (error) {
                console.log('GAMEID FAILED :', error, ' SO NOW TRYING BY TEAMS')
                // If gameId fails, try with team names
                data = await bettingService.getGameByTeams(homeTeam, awayTeam, gameDate!);
                console.log('TEAMS WORKED. DATA IS : ', data);
                // If we got data but no gameId is set, set it
                if (data && !data.gameId) {
                    console.log('THE DATA HAS NO GAMEID, SO SETTING IT NOW.....')
                    await bettingService.setGameId(homeTeam, awayTeam, gameDate!, gameId);
                }
            }
            console.log('EVERYTHING SUCCESSFUL. FINAL DATA IS: ', data);
            setGameBettingInfo(data);
            setError(null);
        } catch (err) {
            console.log('ERROR : ', err);
            setError((err as Error).message);
            setGameBettingInfo(null);
        } finally {
            setLoading(false);
        }
    }, [gameId, homeTeam, awayTeam, gameDate]);

    // Initial fetch
    useEffect(() => {
        if (homeTeam && awayTeam && gameDate) {
            fetchGameData();
        }
    }, [homeTeam, awayTeam, gameDate, fetchGameData]);

    // Handle WebSocket updates
    useEffect(() => {
        if (lastMessage) {
            console.log('LAST MESSAGE IS ', lastMessage);
            const { type, gameId: msgGameId, homeTeam: msgHomeTeam, awayTeam: msgAwayTeam, gameDate: msgGameDate } = lastMessage;
            
            const isRelevantUpdate = 
                (type === 'ODDS_UPDATE' && msgGameId === gameId) ||
                (type === 'ODDS_UPDATE_BY_TEAMS' && 
                 msgHomeTeam === homeTeam && 
                 msgAwayTeam === awayTeam && 
                 msgGameDate === gameDate);

            if (isRelevantUpdate) {
                console.log('LAST MESSAGE FROM SOCKET MATCHES THIS GAME, SO CALLING API TO UPDATE ODDS NOW...')
                fetchGameData();
            }
        }
    }, [lastMessage, gameId, homeTeam, awayTeam, gameDate, fetchGameData]);

    return { gameBettingInfo, loading, error, isConnected };
}