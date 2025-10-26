import getBoxScore from "@/actions/getBoxScore";
import { API } from "@/constants";
import { parseGames } from "@/utils/mappers";
import { getGamesFromLeagueSchedule, scheduleUrl } from "@/service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") || "today";
  // cant cache because JSON size is over Nextjs's limit
  // const cache = url.searchParams.get("cache") === "true" ? true : false;
  if (date === "today") {
    const apiUrl = `${API.DETAILS_URL}/scoreboard/todaysScoreboard_00.json`;
    try {
      // Use fetch with explicit no-cache options
      const res = await fetch(apiUrl, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`NBA API responded with status: ${res.status}`);
      }

      const data = await res.json();
      const parsedGames = parseGames(data.scoreboard.games);
      // Use Promise.all to parallelize the updates
      await Promise.all(
        parsedGames.map(async (game) => {
          let gameId;
          let boxscoreData;
          try {
            gameId = game.gameId;
            boxscoreData = await getBoxScore(gameId);
          } catch (e) {
            // console.log(
            //   "This game hasnt started yet according to boxscore api, skipping...",
            // );
            return;
          }
          // console.log(
          //   "SCHEDULE API HAS GAMESTATUS ",
          //   game.gameStatus,
          //   " AND BOXSCORE API HAS STATUS ",
          //   boxscoreData.gameStatus,
          // );
          game.gameStatus = boxscoreData.gameStatus;

          if (boxscoreData.gameStatus == 2) {
            // update the game data using boxscore API
            // console.log(
            //   "LOOKING AT ",
            //   game.awayTeam.teamName,
            //   " AT ",
            //   game.homeTeam.teamName,
            // );

            // console.log(
            //   "SCHEDULE API HAS SCORE ",
            //   game.awayTeam.score,
            //   " BOXSCORE API HAS SCORE ",
            //   boxscoreData.awayTeam.score,
            // );
            game.awayTeam.score = boxscoreData.awayTeam.score;
            // console.log(
            //   "SCHEDULE API HAS SCORE ",
            //   game.homeTeam.score,
            //   " BOXSCORE API HAS SCORE ",
            //   boxscoreData.homeTeam.score,
            // );
            game.homeTeam.score = boxscoreData.homeTeam.score;
            game.gameClock = boxscoreData.gameClock;
            game.gameStatus = boxscoreData.gameStatus;
            game.gameStatusText = boxscoreData.gameStatusText;
            game.period = boxscoreData.period;
          }
        }),
      );

      return new Response(JSON.stringify(parsedGames));
    } catch (error) {
      console.error("Error fetching NBA data:", error);
      return Response.json(
        { error: "Failed to fetch NBA data" },
        { status: 500 },
      );
    }
  } else {
    const apiUrl = scheduleUrl;
    console.log("REQUESTED DATE: ", date);

    try {
      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error(`NBA API responded with status: ${res.status}`);
      }
      const data = await res.json();
      const parsedGames = getGamesFromLeagueSchedule(data, date);
      return new Response(JSON.stringify(parsedGames));
    } catch (error) {
      console.error("Error fetching historical NBA data:", error);
      return Response.json(
        { error: "Failed to fetch NBA data" },
        { status: 500 },
      );
    }
  }
}
