const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const bettingService = {
  async getGameByGameId(gameId: string) {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch game");
    }
    return response.json();
  },

  async getGameByTeams(homeTeam: string, awayTeam: string, gameDate: string) {
    const response = await fetch(
      `${API_BASE_URL}/games/by-teams/${homeTeam}/${awayTeam}/${gameDate}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch game");
    }
    return response.json();
  },

  async setGameId(
    homeTeam: string,
    awayTeam: string,
    gameDate: string,
    gameId: string,
  ) {
    const response = await fetch(`${API_BASE_URL}/games/set-game-id`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ homeTeam, awayTeam, gameDate, gameId }),
    });
    if (!response.ok) {
      throw new Error("Failed to set game ID");
    }
    return response.json();
  },
  async markGameEnded(gameId: string) {
    const response = await fetch(
      `${API_BASE_URL}/games/mark-game-ended/${gameId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return await response.json();
  },

  async getTodaysOdds() {
    const response = await fetch(`${API_BASE_URL}/games/today`);
    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to fetch todays odds");
    }
    return response.json();
  },
};
