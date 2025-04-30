import { Boxscore, Period } from "@/types";

function BetCardBoxscore({ game }: { game: Boxscore }) {
  console.log(game);

  return (
    <div className="rounded-lg px-3 flex text-sm justify-between">
      <div className="flex flex-col gap-3 justify-center">
        <span>{`${game.awayTeam.teamCity} ${game.awayTeam.teamName}`}</span>
        <span>{`${game.homeTeam.teamCity} ${game.homeTeam.teamName}`}</span>
      </div>
      <div className="flex flex-col gap-3 justify-center">
        <div className="flex gap-3 items-center">
          <div className="flex gap-2">
            {game.awayTeam.periods.map((period) => (
              <span key={period.period}>{period.score}</span>
            ))}
          </div>
          <span className="font-bold text-base">{game.awayTeam.score}</span>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex gap-2">
            {game.homeTeam.periods.map((period) => (
              <span key={period.period}>{period.score}</span>
            ))}
          </div>
          <span className="font-bold text-base">{game.homeTeam.score}</span>
        </div>
      </div>
    </div>
  );
}

export default BetCardBoxscore;
