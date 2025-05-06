import useTodaysOdds from "@/hooks/useTodaysOdds";
import { Separator } from "./ui/separator";
import OddsRow from "./OddsRow";
import type { GameBettingInfo } from "@/types";

export default function LiveOddsPage() {
  const { todaysOdds, loading, error, isConnected } = useTodaysOdds();
  console.log(todaysOdds);

  const listOfGames =
    !loading && todaysOdds
      ? todaysOdds.map(([date, games]) => {
          return (
            <div key={date} className="flex flex-col gap-1">
              <div className=" font-montserrat font-bold sm:text-lg">
                {date.toUpperCase()}
              </div>
              <div className="flex flex-col gap-4">
                {games.map((game: GameBettingInfo) => (
                  <div key={game.id} className="flex flex-col gap-1">
                    <Separator />
                    <div className="flex justify-between items-center">
                      <OddsRow
                        gameBettingInfo={game}
                        isAwayTeam={true}
                        gameId={game.gameId}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <OddsRow
                        gameBettingInfo={game}
                        isAwayTeam={false}
                        gameId={game.gameId}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      : Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg h-2 w-full bg-[var(--background-color)]"
          ></div>
        ));
  return (
    <div className="w-full max-w-[600px] space-y-12">
      {!todaysOdds && error ? (
        <span>
          Try reloading the page or try again later. If the issue persists, live
          odds may be temporarily unavailable.
        </span>
      ) : !loading && !todaysOdds ? (
        <div>There are no scheduled games today.</div>
      ) : (
        <>
          {!isConnected && (
            <div className="text-yellow-500">
              ⚠️ Real-time updates temporarily unavailable
            </div>
          )}
          {listOfGames}
        </>
      )}
    </div>
  );
}
