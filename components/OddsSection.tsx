import { Loader } from "lucide-react";
import { nbaTeams } from "@/utils/getTeamNames";
import Image from "next/image";
import useGameBettingInfo from "@/hooks/useGameBettingInfo";
import { Boxscore, GameBettingInfo } from "@/types";
import { fullNbaTeams } from "@/utils/getTeamNames";
import React from "react";
import OddsBox from "./OddsBox";
import { getMoneyline, getSpread } from "@/utils/formatOdds";

type OddsSectionProps = {
  boxscore: Boxscore;
  gameId: string;
};

export default function OddsSection({ boxscore, gameId }: OddsSectionProps) {
  const awayTeamName = fullNbaTeams[boxscore?.awayTeam.teamName];
  const homeTeamName = fullNbaTeams[boxscore?.homeTeam.teamName];
  const gameDate = boxscore?.gameTimeLocal.toString().split("T")[0];
  const { gameBettingInfo, loading, error, isConnected } = useGameBettingInfo(
    gameId,
    homeTeamName,
    awayTeamName,
    gameDate,
  );

  return (
    <div>
      <span className="font-bold tracking-widest">
        {gameBettingInfo?.hasEnded ? "OPENING" : "LIVE"} ODDS
      </span>
      <div className="flex flex-col gap-2">
        {loading ? (
          <Loader className="animate-spin" />
        ) : !gameBettingInfo && error ? (
          <span>
            Try reloading the page or try again later. If the issue persists,
            betting information may not be available for this game.
          </span>
        ) : !gameBettingInfo ? (
          <div>No betting information available</div>
        ) : (
          <>
            {!isConnected && (
              <div className="text-yellow-500">
                ⚠️ Real-time updates temporarily unavailable
              </div>
            )}
            <div className="flex justify-between items-center">
              <OddsRow
                gameBettingInfo={gameBettingInfo}
                teamId={boxscore.awayTeam.teamId}
                isAwayTeam={true}
                gameId={gameId}
              />
            </div>
            <div className="flex justify-between items-center">
              <OddsRow
                gameBettingInfo={gameBettingInfo}
                teamId={boxscore.homeTeam.teamId}
                isAwayTeam={false}
                gameId={gameId}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type OddsRowProps = {
  gameBettingInfo: GameBettingInfo;
  teamId: number;
  isAwayTeam: boolean;
  gameId: string;
};

function OddsRow({
  gameBettingInfo,
  teamId,
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

  const teamNames = {
    home: gameBettingInfo.homeTeam,
    away: gameBettingInfo.awayTeam,
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {isAwayTeam && <div className="invisible">s</div>}
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
            bettingLine={homeSpread}
            gameId={gameId}
            teams={teamNames}
          >
            <div
              data-clickable="true"
              className="bg-gray-200 cursor-pointer dark:bg-gray-700 flex sm:w-[81px] h-[68px] w-[70px] text-sm sm:text-base tracking-normal sm:tracking-wide flex-col rounded-md p-2 items-center font-semibold justify-center"
            >
              {homeSpread === null ||
              (!gameBettingInfo.hasEnded && spreadOdds === null) ? (
                <span className="my-auto">-</span>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <span>
                    {getSpread(homeSpread, isAwayTeam ? "away" : "home")}
                  </span>
                  {!gameBettingInfo.hasEnded && (
                    <span>{spreadOdds!.toString().replace(/\.?0+$/, "")}</span>
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
            teams={teamNames}
          >
            <div
              data-clickable="true"
              className="bg-gray-200 cursor-pointer dark:bg-gray-700 flex sm:w-[81px] h-[68px] w-[70px] text-sm sm:text-base tracking-normal sm:tracking-wide flex-col rounded-md p-2 items-center font-semibold justify-center"
            >
              {overUnder === null ||
              (!gameBettingInfo.hasEnded &&
                gameBettingInfo.overOdds === null) ? (
                <span className="my-auto">-</span>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <span>
                    {overUnder && overUnderSymbol}{" "}
                    {overUnder.toString().replace(/\.?0+$/, "")}
                  </span>
                  {!gameBettingInfo.hasEnded && (
                    <span>
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
              teams={teamNames}
            >
              <div
                data-clickable="true"
                className="bg-gray-200 cursor-pointer dark:bg-gray-700 flex sm:w-[81px] h-[68px] w-[70px] text-sm sm:text-base tracking-normal sm:tracking-wide justify-center rounded-md p-2 items-center"
              >
                <span className="font-semibold tracking-wide">
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
