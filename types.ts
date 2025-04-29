// export type ScoreboardResponse = {
//   meta: {
//     version: number;
//     request: string;
//     time: string;
//     code: number;
//   };
//   scoreboard: {
//     gameDate: string;
//     leagueId: string;
//     leagueName: string;
//     games: Array<{
//       gameId: string;
//       gameCode: string;
//       gameStatus: number;
//       gameStatusText: string;
//       period: number;
//       gameClock: string;
//       gameTimeUTC: string;
//       gameEt: string;
//       regulationPeriods: number;
//       ifNecessary: boolean;
//       seriesGameNumber: string;
//       seriesText: string;
//       homeTeam: {
//         teamId: number;
//         teamName: string;
//         teamCity: string;
//         teamTricode: string;
//         wins: number;
//         losses: number;
//         score: number;
//         seed: any;
//         inBonus?: string;
//         timeoutsRemaining: number;
//         periods: Array<{
//           period: number;
//           periodType: string;
//           score: number;
//         }>;
//       };
//       awayTeam: {
//         teamId: number;
//         teamName: string;
//         teamCity: string;
//         teamTricode: string;
//         wins: number;
//         losses: number;
//         score: number;
//         seed: any;
//         inBonus?: string;
//         timeoutsRemaining: number;
//         periods: Array<{
//           period: number;
//           periodType: string;
//           score: number;
//         }>;
//       };
//       gameLeaders: {
//         homeLeaders: {
//           personId: number;
//           name: string;
//           jerseyNum: string;
//           position: string;
//           teamTricode: string;
//           playerSlug?: string;
//           points: number;
//           rebounds: number;
//           assists: number;
//         };
//         awayLeaders: {
//           personId: number;
//           name: string;
//           jerseyNum: string;
//           position: string;
//           teamTricode: string;
//           playerSlug?: string;
//           points: number;
//           rebounds: number;
//           assists: number;
//         };
//       };
//       pbOdds: {
//         team: any;
//         odds: number;
//         suspended: number;
//       };
//     }>;
//   };
// };

// export type LiveGame = ScoreboardResponse["scoreboard"]["games"][number];

// export type BoxscoreResponse = {
//   meta: {
//     version: number;
//     code: number;
//     request: string;
//     time: string;
//   };
//   game: {
//     gameId: string;
//     gameTimeLocal: string;
//     gameTimeUTC: string;
//     gameTimeHome: string;
//     gameTimeAway: string;
//     gameEt: string;
//     duration: number;
//     gameCode: string;
//     gameStatusText: string;
//     gameStatus: number;
//     regulationPeriods: number;
//     period: number;
//     gameClock: string;
//     attendance: number;
//     sellout: string;
//     arena: {
//       arenaId: number;
//       arenaName: string;
//       arenaCity: string;
//       arenaState: string;
//       arenaCountry: string;
//       arenaTimezone: string;
//     };
//     officials: Array<{
//       personId: number;
//       name: string;
//       nameI: string;
//       firstName: string;
//       familyName: string;
//       jerseyNum: string;
//       assignment: string;
//     }>;
//     homeTeam: {
//       teamId: number;
//       teamName: string;
//       teamCity: string;
//       teamTricode: string;
//       score: number;
//       inBonus: string;
//       timeoutsRemaining: number;
//       periods: Array<{
//         period: number;
//         periodType: string;
//         score: number;
//       }>;
//       players: Array<{
//         status: string;
//         order: number;
//         personId: number;
//         jerseyNum: string;
//         position?: string;
//         starter: string;
//         oncourt: string;
//         played: string;
//         statistics: {
//           assists: number;
//           blocks: number;
//           blocksReceived: number;
//           fieldGoalsAttempted: number;
//           fieldGoalsMade: number;
//           fieldGoalsPercentage: number;
//           foulsOffensive: number;
//           foulsDrawn: number;
//           foulsPersonal: number;
//           foulsTechnical: number;
//           freeThrowsAttempted: number;
//           freeThrowsMade: number;
//           freeThrowsPercentage: number;
//           minus: number;
//           minutes: string;
//           minutesCalculated: string;
//           plus: number;
//           plusMinusPoints: number;
//           points: number;
//           pointsFastBreak: number;
//           pointsInThePaint: number;
//           pointsSecondChance: number;
//           reboundsDefensive: number;
//           reboundsOffensive: number;
//           reboundsTotal: number;
//           steals: number;
//           threePointersAttempted: number;
//           threePointersMade: number;
//           threePointersPercentage: number;
//           turnovers: number;
//           twoPointersAttempted: number;
//           twoPointersMade: number;
//           twoPointersPercentage: number;
//         };
//         name: string;
//         nameI: string;
//         firstName: string;
//         familyName: string;
//         notPlayingReason?: string;
//         notPlayingDescription?: string;
//       }>;
//       statistics: {
//         assists: number;
//         assistsTurnoverRatio: number;
//         benchPoints: number;
//         biggestLead: number;
//         biggestLeadScore: string;
//         biggestScoringRun: number;
//         biggestScoringRunScore: string;
//         blocks: number;
//         blocksReceived: number;
//         fastBreakPointsAttempted: number;
//         fastBreakPointsMade: number;
//         fastBreakPointsPercentage: number;
//         fieldGoalsAttempted: number;
//         fieldGoalsEffectiveAdjusted: number;
//         fieldGoalsMade: number;
//         fieldGoalsPercentage: number;
//         foulsOffensive: number;
//         foulsDrawn: number;
//         foulsPersonal: number;
//         foulsTeam: number;
//         foulsTechnical: number;
//         foulsTeamTechnical: number;
//         freeThrowsAttempted: number;
//         freeThrowsMade: number;
//         freeThrowsPercentage: number;
//         leadChanges: number;
//         minutes: string;
//         minutesCalculated: string;
//         points: number;
//         pointsAgainst: number;
//         pointsFastBreak: number;
//         pointsFromTurnovers: number;
//         pointsInThePaint: number;
//         pointsInThePaintAttempted: number;
//         pointsInThePaintMade: number;
//         pointsInThePaintPercentage: number;
//         pointsSecondChance: number;
//         reboundsDefensive: number;
//         reboundsOffensive: number;
//         reboundsPersonal: number;
//         reboundsTeam: number;
//         reboundsTeamDefensive: number;
//         reboundsTeamOffensive: number;
//         reboundsTotal: number;
//         secondChancePointsAttempted: number;
//         secondChancePointsMade: number;
//         secondChancePointsPercentage: number;
//         steals: number;
//         threePointersAttempted: number;
//         threePointersMade: number;
//         threePointersPercentage: number;
//         timeLeading: string;
//         timesTied: number;
//         trueShootingAttempts: number;
//         trueShootingPercentage: number;
//         turnovers: number;
//         turnoversTeam: number;
//         turnoversTotal: number;
//         twoPointersAttempted: number;
//         twoPointersMade: number;
//         twoPointersPercentage: number;
//       };
//     };
//     awayTeam: {
//       teamId: number;
//       teamName: string;
//       teamCity: string;
//       teamTricode: string;
//       score: number;
//       inBonus: string;
//       timeoutsRemaining: number;
//       periods: Array<{
//         period: number;
//         periodType: string;
//         score: number;
//       }>;
//       players: Array<{
//         status: string;
//         order: number;
//         personId: number;
//         jerseyNum: string;
//         position?: string;
//         starter: string;
//         oncourt: string;
//         played: string;
//         statistics: {
//           assists: number;
//           blocks: number;
//           blocksReceived: number;
//           fieldGoalsAttempted: number;
//           fieldGoalsMade: number;
//           fieldGoalsPercentage: number;
//           foulsOffensive: number;
//           foulsDrawn: number;
//           foulsPersonal: number;
//           foulsTechnical: number;
//           freeThrowsAttempted: number;
//           freeThrowsMade: number;
//           freeThrowsPercentage: number;
//           minus: number;
//           minutes: string;
//           minutesCalculated: string;
//           plus: number;
//           plusMinusPoints: number;
//           points: number;
//           pointsFastBreak: number;
//           pointsInThePaint: number;
//           pointsSecondChance: number;
//           reboundsDefensive: number;
//           reboundsOffensive: number;
//           reboundsTotal: number;
//           steals: number;
//           threePointersAttempted: number;
//           threePointersMade: number;
//           threePointersPercentage: number;
//           turnovers: number;
//           twoPointersAttempted: number;
//           twoPointersMade: number;
//           twoPointersPercentage: number;
//         };
//         name: string;
//         nameI: string;
//         firstName: string;
//         familyName: string;
//         notPlayingReason?: string;
//         notPlayingDescription?: string;
//       }>;
//       statistics: {
//         assists: number;
//         assistsTurnoverRatio: number;
//         benchPoints: number;
//         biggestLead: number;
//         biggestLeadScore: string;
//         biggestScoringRun: number;
//         biggestScoringRunScore: string;
//         blocks: number;
//         blocksReceived: number;
//         fastBreakPointsAttempted: number;
//         fastBreakPointsMade: number;
//         fastBreakPointsPercentage: number;
//         fieldGoalsAttempted: number;
//         fieldGoalsEffectiveAdjusted: number;
//         fieldGoalsMade: number;
//         fieldGoalsPercentage: number;
//         foulsOffensive: number;
//         foulsDrawn: number;
//         foulsPersonal: number;
//         foulsTeam: number;
//         foulsTechnical: number;
//         foulsTeamTechnical: number;
//         freeThrowsAttempted: number;
//         freeThrowsMade: number;
//         freeThrowsPercentage: number;
//         leadChanges: number;
//         minutes: string;
//         minutesCalculated: string;
//         points: number;
//         pointsAgainst: number;
//         pointsFastBreak: number;
//         pointsFromTurnovers: number;
//         pointsInThePaint: number;
//         pointsInThePaintAttempted: number;
//         pointsInThePaintMade: number;
//         pointsInThePaintPercentage: number;
//         pointsSecondChance: number;
//         reboundsDefensive: number;
//         reboundsOffensive: number;
//         reboundsPersonal: number;
//         reboundsTeam: number;
//         reboundsTeamDefensive: number;
//         reboundsTeamOffensive: number;
//         reboundsTotal: number;
//         secondChancePointsAttempted: number;
//         secondChancePointsMade: number;
//         secondChancePointsPercentage: number;
//         steals: number;
//         threePointersAttempted: number;
//         threePointersMade: number;
//         threePointersPercentage: number;
//         timeLeading: string;
//         timesTied: number;
//         trueShootingAttempts: number;
//         trueShootingPercentage: number;
//         turnovers: number;
//         turnoversTeam: number;
//         turnoversTotal: number;
//         twoPointersAttempted: number;
//         twoPointersMade: number;
//         twoPointersPercentage: number;
//       };
//     };
//   };
// };

export type LeagueScheduleResponse = {
  meta: {
    version: number;
    request: string;
    time: string;
  };
  leagueSchedule: {
    seasonYear: string;
    leagueId: string;
    gameDates: Array<{
      gameDate: string;
      games: Array<{
        gameId: string;
        gameCode: string;
        gameStatus: number;
        gameStatusText: string;
        gameSequence: number;
        gameDateEst: string;
        gameTimeEst: string;
        gameDateTimeEst: string;
        gameDateUTC: string;
        gameTimeUTC: string;
        gameDateTimeUTC: string;
        awayTeamTime: string;
        homeTeamTime: string;
        day: string;
        monthNum: number;
        weekNumber: number;
        weekName: string;
        ifNecessary: boolean;
        seriesGameNumber: string;
        seriesText: string;
        arenaName: string;
        arenaState: string;
        arenaCity: string;
        postponedStatus: string;
        branchLink: string;
        broadcasters: {
          nationalTvBroadcasters: Array<{
            broadcasterScope: string;
            broadcasterMedia: string;
            broadcasterId: number;
            broadcasterDisplay: string;
            broadcasterAbbreviation: string;
            tapeDelayComments: string;
            regionId: number;
          }>;
          nationalRadioBroadcasters: Array<{
            broadcasterScope: string;
            broadcasterMedia: string;
            broadcasterId: number;
            broadcasterDisplay: string;
            broadcasterAbbreviation: string;
            tapeDelayComments: string;
            regionId: number;
          }>;
          homeTvBroadcasters: Array<{
            broadcasterScope: string;
            broadcasterMedia: string;
            broadcasterId: number;
            broadcasterDisplay: string;
            broadcasterAbbreviation: string;
            tapeDelayComments: string;
            regionId: number;
          }>;
          homeRadioBroadcasters: Array<{
            broadcasterScope: string;
            broadcasterMedia: string;
            broadcasterId: number;
            broadcasterDisplay: string;
            broadcasterAbbreviation: string;
            tapeDelayComments: string;
            regionId: number;
          }>;
          awayTvBroadcasters: Array<{
            broadcasterScope: string;
            broadcasterMedia: string;
            broadcasterId: number;
            broadcasterDisplay: string;
            broadcasterAbbreviation: string;
            tapeDelayComments: string;
            regionId: number;
          }>;
          awayRadioBroadcasters: Array<{
            broadcasterScope: string;
            broadcasterMedia: string;
            broadcasterId: number;
            broadcasterDisplay: string;
            broadcasterAbbreviation: string;
            tapeDelayComments: string;
            regionId: number;
          }>;
          intlRadioBroadcasters: Array<any>;
          intlTvBroadcasters: Array<any>;
        };
        homeTeam: {
          teamId: number;
          teamName: string;
          teamCity: string;
          teamTricode: string;
          teamSlug: string;
          wins: number;
          losses: number;
          score: number;
          seed: number;
        };
        awayTeam: {
          teamId: number;
          teamName: string;
          teamCity: string;
          teamTricode: string;
          teamSlug: string;
          wins: number;
          losses: number;
          score: number;
          seed: number;
        };
        pointsLeaders: Array<{
          personId: number;
          firstName: string;
          lastName: string;
          teamId: number;
          teamCity: string;
          teamName: string;
          teamTricode: string;
          points: number;
        }>;
      }>;
    }>;
    weeks: Array<{
      weekNumber: number;
      weekName: string;
      startDate: string;
      endDate: string;
    }>;
    broadcasterList: Array<{
      broadcasterId: number;
      broadcasterDisplay: string;
      broadcasterAbbreviation: string;
      regionId: number;
    }>;
  };
};

// export type Game =
//   LeagueScheduleResponse["leagueSchedule"]["gameDates"][number]["games"][number];

// =============================================================================
export type NBATeamAcronyms = {
  [key: string]: string;
};

export type Games = {
  meta: Meta;
  scoreboard: Scoreboard;
};

export type Meta = {
  version: number;
  request: string;
  time: Date;
};

export type Scoreboard = {
  gameDate: Date;
  leagueId: string;
  leagueName: string;
  games: Game[];
};

export type Game = {
  gameId: string;
  gameCode: string;
  gameStatus: number;
  gameStatusText: string;
  period: number;
  gameClock: string;
  gameTimeUTC: Date;
  gameEt: Date;
  regulationPeriods: number;
  seriesGameNumber: string;
  seriesText: string;
  ifNecessary: boolean;
  seriesConference: string;
  poRoundDesc: string;
  gameSubtype: string;
  gameLeaders: GameLeaders;
  teamLeaders: TeamLeaders;
  broadcasters: Broadcasters;
  homeTeam: Team;
  awayTeam: Team;
};

export type ScheduleGame = {
  gameId: string;
  gameStatus: number;
  gameStatusText: string;
  period: number;
  gameClock: string;
  gameTimeUTC: Date;
  homeTeam: Team;
  awayTeam: Team;
};

export type ScheduleTeam = {
  teamId: number;
  teamName: string;
  teamTricode: string;
  wins: number;
  losses: number;
  score: number;
};

export type TeamStatistics = {
  assists: number;
  assistsTurnoverRatio: number;
  benchPoints: number;
  biggestLead: number;
  biggestLeadScore: string;
  biggestScoringRun: number;
  biggestScoringRunScore: string;
  blocks: number;
  blocksReceived: number;
  fastBreakPointsAttempted: number;
  fastBreakPointsMade: number;
  fastBreakPointsPercentage: number;
  fieldGoalsAttempted: number;
  fieldGoalsEffectiveAdjusted: number;
  fieldGoalsMade: number;
  fieldGoalsPercentage: number;
  foulsOffensive: number;
  foulsDrawn: number;
  foulsPersonal: number;
  foulsTeam: number;
  foulsTechnical: number;
  foulsTeamTechnical: number;
  freeThrowsAttempted: number;
  freeThrowsMade: number;
  freeThrowsPercentage: number;
  leadChanges: number;
  minutes: string;
  minutesCalculated: string;
  points: number;
  pointsAgainst: number;
  pointsFastBreak: number;
  pointsFromTurnovers: number;
  pointsInThePaint: number;
  pointsInThePaintAttempted: number;
  pointsInThePaintMade: number;
  pointsInThePaintPercentage: number;
  pointsSecondChance: number;
  reboundsDefensive: number;
  reboundsOffensive: number;
  reboundsPersonal: number;
  reboundsTeam: number;
  reboundsTeamDefensive: number;
  reboundsTeamOffensive: number;
  reboundsTotal: number;
  secondChancePointsAttempted: number;
  secondChancePointsMade: number;
  secondChancePointsPercentage: number;
  steals: number;
  threePointersAttempted: number;
  threePointersMade: number;
  threePointersPercentage: number;
  timeLeading: string;
  timesTied: number;
  trueShootingAttempts: number;
  trueShootingPercentage: number;
  turnovers: number;
  turnoversTeam: number;
  turnoversTotal: number;
  twoPointersAttempted: number;
  twoPointersMade: number;
  twoPointersPercentage: number;
};

export type Team = {
  teamId: number;
  teamName: string;
  teamCity: string;
  teamTricode: string;
  teamSlug: string;
  wins: number;
  losses: number;
  score: number;
  seed: number;
  inBonus: null;
  timeoutsRemaining: number;
  periods: Period[];
  players: Player[];
  statistics: TeamStatistics;
};

export type Broadcasters = {
  nationalBroadcasters: Broadcaster[];
  nationalRadioBroadcasters: Broadcaster[];
  nationalOttBroadcasters: any[];
  homeTvBroadcasters: Broadcaster[];
  homeRadioBroadcasters: Broadcaster[];
  homeOttBroadcasters: any[];
  awayTvBroadcasters: Broadcaster[];
  awayRadioBroadcasters: Broadcaster[];
  awayOttBroadcasters: Broadcaster[];
};

export type Broadcaster = {
  broadcasterId: number;
  broadcastDisplay: string;
  broadcasterTeamId: number;
};

export type GameLeaders = {
  homeLeaders: Leaders;
  awayLeaders: Leaders;
};

export type Leaders = {
  personId: number;
  name: string;
  playerSlug: string;
  jerseyNum: string;
  position: string;
  teamTricode: string;
  points: number;
  rebounds: number;
  assists: number;
};

export type TeamLeaders = {
  homeLeaders: Leaders;
  awayLeaders: Leaders;
  seasonLeadersFlag: number;
};

export interface TeamStats {
  teamId: number;
  teamName: string;
  teamCity: string;
  teamTricode: string;
  score: number;
  inBonus: string;
  timeoutsRemaining: number;
  periods: Period[];
  players: Player[];
  statistics: TeamStatistics;
}

export interface Period {
  period: number;
  periodType: string;
  score: number;
}

export interface Player {
  status: Status;
  order: number;
  personId: number;
  jerseyNum: string;
  position?: string;
  starter: string;
  oncourt: string;
  played: string;
  statistics: PlayerStatistics;
  name: string;
  nameI: string;
  firstName: string;
  familyName: string;
  notPlayingReason?: string;
  notPlayingDescription?: string;
}

export interface PlayerStatistics {
  assists: number;
  blocks: number;
  blocksReceived: number;
  fieldGoalsAttempted: number;
  fieldGoalsMade: number;
  fieldGoalsPercentage: number;
  foulsOffensive: number;
  foulsDrawn: number;
  foulsPersonal: number;
  foulsTechnical: number;
  freeThrowsAttempted: number;
  freeThrowsMade: number;
  freeThrowsPercentage: number;
  minus: number;
  minutes: string;
  minutesCalculated: string;
  plus: number;
  plusMinusPoints: number;
  points: number;
  pointsFastBreak: number;
  pointsInThePaint: number;
  pointsSecondChance: number;
  reboundsDefensive: number;
  reboundsOffensive: number;
  reboundsTotal: number;
  steals: number;
  threePointersAttempted: number;
  threePointersMade: number;
  threePointersPercentage: number;
  turnovers: number;
  twoPointersAttempted: number;
  twoPointersMade: number;
  twoPointersPercentage: number;
}

export enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

export interface Boxscore {
  gameId: string;
  gameTimeLocal: Date;
  gameTimeUTC: Date;
  gameTimeHome: Date;
  gameTimeAway: Date;
  gameEt: Date;
  duration: number;
  gameCode: string;
  gameStatusText: string;
  gameStatus: number;
  regulationPeriods: number;
  period: number;
  gameClock: string;
  attendance: number;
  sellout: string;
  arena: Arena;
  officials: Official[];
  homeTeam: Team;
  awayTeam: Team;
}

export interface Arena {
  arenaId: number;
  arenaName: string;
  arenaCity: string;
  arenaState: string;
  arenaCountry: string;
  arenaTimezone: string;
}

export interface Period {
  period: number;
  periodType: string;
  score: number;
}

export interface Player {
  status: Status;
  order: number;
  personId: number;
  jerseyNum: string;
  position?: string;
  starter: string;
  oncourt: string;
  played: string;
  statistics: PlayerStatistics;
  name: string;
  nameI: string;
  firstName: string;
  familyName: string;
  notPlayingReason?: string;
  notPlayingDescription?: string;
}

export interface PlayerStatistics {
  assists: number;
  blocks: number;
  blocksReceived: number;
  fieldGoalsAttempted: number;
  fieldGoalsMade: number;
  fieldGoalsPercentage: number;
  foulsOffensive: number;
  foulsDrawn: number;
  foulsPersonal: number;
  foulsTechnical: number;
  freeThrowsAttempted: number;
  freeThrowsMade: number;
  freeThrowsPercentage: number;
  minus: number;
  minutes: string;
  minutesCalculated: string;
  plus: number;
  plusMinusPoints: number;
  points: number;
  pointsFastBreak: number;
  pointsInThePaint: number;
  pointsSecondChance: number;
  reboundsDefensive: number;
  reboundsOffensive: number;
  reboundsTotal: number;
  steals: number;
  threePointersAttempted: number;
  threePointersMade: number;
  threePointersPercentage: number;
  turnovers: number;
  twoPointersAttempted: number;
  twoPointersMade: number;
  twoPointersPercentage: number;
}

export interface AwayTeamStatistics {
  assists: number;
  assistsTurnoverRatio: number;
  benchPoints: number;
  biggestLead: number;
  biggestLeadScore: string;
  biggestScoringRun: number;
  biggestScoringRunScore: string;
  blocks: number;
  blocksReceived: number;
  fastBreakPointsAttempted: number;
  fastBreakPointsMade: number;
  fastBreakPointsPercentage: number;
  fieldGoalsAttempted: number;
  fieldGoalsEffectiveAdjusted: number;
  fieldGoalsMade: number;
  fieldGoalsPercentage: number;
  foulsOffensive: number;
  foulsDrawn: number;
  foulsPersonal: number;
  foulsTeam: number;
  foulsTechnical: number;
  foulsTeamTechnical: number;
  freeThrowsAttempted: number;
  freeThrowsMade: number;
  freeThrowsPercentage: number;
  leadChanges: number;
  minutes: string;
  minutesCalculated: string;
  points: number;
  pointsAgainst: number;
  pointsFastBreak: number;
  pointsFromTurnovers: number;
  pointsInThePaint: number;
  pointsInThePaintAttempted: number;
  pointsInThePaintMade: number;
  pointsInThePaintPercentage: number;
  pointsSecondChance: number;
  reboundsDefensive: number;
  reboundsOffensive: number;
  reboundsPersonal: number;
  reboundsTeam: number;
  reboundsTeamDefensive: number;
  reboundsTeamOffensive: number;
  reboundsTotal: number;
  secondChancePointsAttempted: number;
  secondChancePointsMade: number;
  secondChancePointsPercentage: number;
  steals: number;
  threePointersAttempted: number;
  threePointersMade: number;
  threePointersPercentage: number;
  timeLeading: string;
  timesTied: number;
  trueShootingAttempts: number;
  trueShootingPercentage: number;
  turnovers: number;
  turnoversTeam: number;
  turnoversTotal: number;
  twoPointersAttempted: number;
  twoPointersMade: number;
  twoPointersPercentage: number;
}

export interface Official {
  personId: number;
  name: string;
  nameI: string;
  firstName: string;
  familyName: string;
  jerseyNum: string;
  assignment: string;
}

export type GameBettingInfo = {
  id: number;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  homeSpreadOdds: null | number;
  awaySpreadOdds: null | number;
  homeSpread: null | number;
  openingHomeSpread: number;
  homeMoneyline: null | number;
  awayMoneyline: null | number;
  openingOverUnder: number;
  overUnder: null | number;
  overOdds: null | number;
  hasEnded: boolean;
  gameDate: string;
};

// type for the odds boxes on home page
export type CurrentGameBettingInfo = {
  id: number;
  gameId: string | undefined;
  homeTeam: string;
  awayTeam: string;
  homeSpreadOdds: null | number;
  awaySpreadOdds: null | number;
  homeSpread: null | number;
  homeMoneyline: null | number;
  awayMoneyline: null | number;
  overUnder: null | number;
  overOdds: null | number;
};

export type GameBettingInfos = [string, GameBettingInfo[]][];

export type User = {
  username: string;
  id: number;
  amount_deposited: number;
  amount_placed: number;
  amount_won: number;
  balance: number;
  bets_placed: number;
  bets_won: number;
  created_at: Date;
};

export type UserBetWithGameInfo = {
  id: number;
  userId: number;
  gameId: number;
  betType:
    | "SPREAD_HOME"
    | "SPREAD_AWAY"
    | "MONEYLINE_HOME"
    | "MONEYLINE_AWAY"
    | "OVER"
    | "UNDER";
  odds: string;
  amountPlaced: string;
  totalPayout: string;
  placedAt: string; // datetime -> ISO string (e.g., "2025-04-19T15:30:00Z")
  status: string;
  homeTeam: string;
  awayTeam: string;
  bettingLine: string;
  gameDate: string;
};
