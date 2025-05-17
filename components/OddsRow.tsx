import type { GameBettingInfo } from "@/types";
import Image from "next/image";
import { nbaTeams } from "@/utils/getTeamNames";
import OddsBox from "./OddsBox";
import { getMoneyline, getSpread } from "@/utils/formatOdds";
import { teamIds } from "@/constants";

type OddsRowProps = {
  gameBettingInfo: GameBettingInfo;
  isAwayTeam: boolean;
  gameId: string;
};

export default function OddsRow({
  gameBettingInfo,
  isAwayTeam,
  gameId,
}: OddsRowProps) {
  const spreadOdds = isAwayTeam
    ? gameBettingInfo.awaySpreadOdds
    : gameBettingInfo.homeSpreadOdds;
  const overUnderSymbol = isAwayTeam ? "O" : "U";
  const overUnder = gameBettingInfo.hasEnded
    ? gameBettingInfo.openingOverUnder
    : gameBettingInfo.overUnder;
  const homeSpread = gameBettingInfo.hasEnded
    ? gameBettingInfo.openingHomeSpread
    : gameBettingInfo.homeSpread;

  type TeamName = keyof typeof teamIds;
  const teamNames = {
    home: gameBettingInfo.homeTeam as TeamName,
    away: gameBettingInfo.awayTeam as TeamName,
  };
  const teamId = isAwayTeam ? teamIds[teamNames.away] : teamIds[teamNames.home];

  return (
    <>
      <div className="flex flex-col gap-2">
        {isAwayTeam && (
          <div data-testid="invisible" className="invisible">
            s
          </div>
        )}
        <div className="tracking-tight leading-4 flex gap-2">
          <div className={`w-[112px]`}>
            <span className="text-sm">
              {
                nbaTeams[
                  isAwayTeam
                    ? gameBettingInfo.awayTeam
                    : gameBettingInfo.homeTeam
                ].city
              }
            </span>
            <br />
            <span className="font-semibold">
              {
                nbaTeams[
                  isAwayTeam
                    ? gameBettingInfo.awayTeam
                    : gameBettingInfo.homeTeam
                ].name
              }
            </span>
          </div>

          <Image
            src={`https://cdn.nba.com/logos/nba/${teamId}/primary/L/logo.svg`}
            width={30}
            height={30}
            alt={"team logo"}
            className="hidden sm:block"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 items-center">
          {isAwayTeam && (
            <span className="tracking-tight text-gray-500 dark:text-gray-400">
              Spread
            </span>
          )}
          <OddsBox
            type={`SPREAD_${isAwayTeam ? "AWAY" : "HOME"}`}
            odds={spreadOdds}
            bettingLine={
              isAwayTeam
                ? +getSpread(homeSpread, "away")
                : +getSpread(homeSpread, "home")
            }
            gameEnded={gameBettingInfo.hasEnded}
            gameId={gameId}
            gameDate={gameBettingInfo.gameDate}
            teams={teamNames}
          >
            <div className="bg-gray-200 cursor-pointer dark:bg-gray-700 flex sm:w-[81px] h-[68px] w-[66px] text-sm sm:text-base tracking-normal sm:tracking-wide flex-col rounded-md p-2 items-center font-semibold justify-center">
              {homeSpread === null ||
              (!gameBettingInfo.hasEnded && spreadOdds === null) ? (
                <span className="my-auto">-</span>
              ) : (
                <div className="flex flex-col justify-center items-center text-[13px] sm:text-base">
                  <span>
                    {getSpread(homeSpread, isAwayTeam ? "away" : "home")}
                  </span>
                  {!gameBettingInfo.hasEnded && (
                    <span>
                      {spreadOdds! > 0 && "+"}
                      {spreadOdds!.toString().replace(/\.?0+$/, "")}
                    </span>
                  )}
                </div>
              )}
            </div>
          </OddsBox>
        </div>
        <div className="flex flex-col gap-2 items-center">
          {isAwayTeam && (
            <span className="tracking-tight text-gray-500 dark:text-gray-400">
              Total
            </span>
          )}
          <OddsBox
            type={overUnderSymbol === "O" ? "OVER" : "UNDER"}
            odds={gameBettingInfo.overOdds}
            bettingLine={overUnder}
            gameId={gameId}
            gameDate={gameBettingInfo.gameDate}
            teams={teamNames}
            gameEnded={gameBettingInfo.hasEnded}
          >
            <div className="bg-gray-200 cursor-pointer dark:bg-gray-700 flex sm:w-[81px] h-[68px] w-[66px] text-sm sm:text-base tracking-normal sm:tracking-wide flex-col rounded-md p-2 items-center font-semibold justify-center">
              {overUnder === null ||
              (!gameBettingInfo.hasEnded &&
                gameBettingInfo.overOdds === null) ? (
                <span className="my-auto">-</span>
              ) : (
                <div className="flex flex-col justify-center items-center text-[12px] sm:text-base">
                  <span>
                    {overUnder && overUnderSymbol}{" "}
                    {overUnder.toString().replace(/\.?0+$/, "")}
                  </span>
                  {!gameBettingInfo.hasEnded && (
                    <span>
                      {gameBettingInfo.overOdds! > 0 && "+"}
                      {gameBettingInfo
                        .overOdds!.toString()
                        .replace(/\.?0+$/, "")}
                    </span>
                  )}
                </div>
              )}
            </div>
          </OddsBox>
        </div>
        {!gameBettingInfo.hasEnded && (
          <div className="flex flex-col gap-2 items-center">
            {isAwayTeam && (
              <span className="text-gray-500 dark:text-gray-400 tracking-tight">
                Money
              </span>
            )}
            <OddsBox
              type={isAwayTeam ? "MONEYLINE_AWAY" : "MONEYLINE_HOME"}
              odds={
                isAwayTeam
                  ? gameBettingInfo.awayMoneyline
                  : gameBettingInfo.homeMoneyline
              }
              gameId={gameId}
              gameDate={gameBettingInfo.gameDate}
              teams={teamNames}
              gameEnded={gameBettingInfo.hasEnded}
            >
              <div className="bg-gray-200 cursor-pointer dark:bg-gray-700 flex sm:w-[81px] h-[68px] w-[66px] text-sm sm:text-base tracking-normal sm:tracking-wide justify-center rounded-md p-2 items-center">
                <span className="font-semibold tracking-wide text-[12px] sm:text-base">
                  {getMoneyline(
                    isAwayTeam
                      ? gameBettingInfo.awayMoneyline
                      : gameBettingInfo.homeMoneyline,
                  )}
                </span>
              </div>
            </OddsBox>
          </div>
        )}
      </div>
    </>
  );
}
