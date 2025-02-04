import { Loader } from "lucide-react";
import { nbaTeams } from "@/utils/getTeamNames";
import Image from "next/image";
import useGameBettingInfo from "@/hooks/useGameBettingInfo";
import { Text, useColorModeValue } from "@chakra-ui/react";
import { Boxscore, GameBettingInfo } from "@/types";
import { Box } from "@chakra-ui/react";
import { fullNbaTeams } from "@/utils/getTeamNames";

type OddsSectionProps = {
  boxscore: Boxscore;
  gameId: string;
};

const getSpread = (
  homeSpread: number | null | undefined,
  type: "home" | "away",
) => {
  if (homeSpread === null || homeSpread === undefined) return "-";
  else if (type === "away") {
    let opposite = -1 * homeSpread;
    if (opposite > 0) return "+" + homeSpread.toString().slice(1);
    return opposite.toString();
  } else {
    if (homeSpread > 0) return "+" + homeSpread.toString();
    return homeSpread.toString();
  }
};

const getMoneyline = (moneyline: number | null | undefined) => {
  if (moneyline === null || moneyline === undefined) return "-";
  if (moneyline > 0) return "+" + moneyline.toString();
  return moneyline;
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
      <span className="font-bold tracking-widest">ODDS</span>
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
              />
            </div>
            <div className="flex justify-between items-center">
              <OddsRow
                gameBettingInfo={gameBettingInfo}
                teamId={boxscore.homeTeam.teamId}
                isAwayTeam={false}
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
};

function OddsRow({ gameBettingInfo, teamId, isAwayTeam }: OddsRowProps) {
  const bg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.500", "gray.400");
  const spreadOdds = isAwayTeam
    ? gameBettingInfo.awaySpreadOdds
    : gameBettingInfo.homeSpreadOdds;
  const overUnderSymbol = isAwayTeam ? "O" : "U";
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
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 items-center">
          {isAwayTeam && (
            <Text textColor={textColor} className="tracking-tight">
              Spread
            </Text>
          )}
          <Box
            bg={bg}
            className="flex w-[81px] h-[68px] flex-col rounded-md p-2 items-center"
          >
            {gameBettingInfo.homeSpread === null || spreadOdds === null ? (
              <span className="my-auto">-</span>
            ) : (
              <div className="font-semibold tracking-wide flex flex-col items-center justify-center">
                <span>
                  {getSpread(
                    gameBettingInfo.homeSpread,
                    isAwayTeam ? "away" : "home",
                  )}
                </span>
                <span>{spreadOdds.toString().replace(/\.?0+$/, "")}</span>
              </div>
            )}
          </Box>
        </div>
        <div className="flex flex-col gap-2 items-center">
          {isAwayTeam && (
            <Text textColor={textColor} className="tracking-tight">
              Total
            </Text>
          )}
          <Box
            bg={bg}
            className="flex w-[81px] h-[68px] flex-col rounded-md p-2 items-center"
          >
            {gameBettingInfo.overUnder === null ||
            gameBettingInfo.overOdds === null ? (
              <span className="my-auto">-</span>
            ) : (
              <div className="font-semibold tracking-wide flex flex-col items-center justify-center">
                <span>
                  {gameBettingInfo.overUnder && overUnderSymbol}{" "}
                  {gameBettingInfo.overUnder.toString().replace(/\.?0+$/, "")}
                </span>
                <span>{gameBettingInfo.overOdds.toString().replace(/\.?0+$/, "")}</span>
              </div>
            )}
          </Box>
        </div>
        <div className="flex flex-col gap-2 items-center">
          {isAwayTeam && (
            <Text textColor={textColor} className="tracking-tight">
              Money
            </Text>
          )}
          <Box
            bg={bg}
            className="flex w-[81px] h-[68px] justify-center rounded-md p-2 items-center"
          >
            <span className="font-semibold tracking-wide">
              {getMoneyline(
                isAwayTeam
                  ? gameBettingInfo.awayMoneyline
                  : gameBettingInfo.homeMoneyline,
              ).toString().replace(/\.?0+$/, "")}
            </span>
          </Box>
        </div>
      </div>
    </>
  );
}
