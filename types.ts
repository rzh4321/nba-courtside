export type ScoreboardResponse = {
  meta: {
    version: number
    request: string
    time: string
    code: number
  }
  scoreboard: {
    gameDate: string
    leagueId: string
    leagueName: string
    games: Array<{
      gameId: string
      gameCode: string
      gameStatus: number
      gameStatusText: string
      period: number
      gameClock: string
      gameTimeUTC: string
      gameEt: string
      regulationPeriods: number
      ifNecessary: boolean
      seriesGameNumber: string
      seriesText: string
      homeTeam: {
        teamId: number
        teamName: string
        teamCity: string
        teamTricode: string
        wins: number
        losses: number
        score: number
        seed: any
        inBonus?: string
        timeoutsRemaining: number
        periods: Array<{
          period: number
          periodType: string
          score: number
        }>
      }
      awayTeam: {
        teamId: number
        teamName: string
        teamCity: string
        teamTricode: string
        wins: number
        losses: number
        score: number
        seed: any
        inBonus?: string
        timeoutsRemaining: number
        periods: Array<{
          period: number
          periodType: string
          score: number
        }>
      }
      gameLeaders: {
        homeLeaders: {
          personId: number
          name: string
          jerseyNum: string
          position: string
          teamTricode: string
          playerSlug?: string
          points: number
          rebounds: number
          assists: number
        }
        awayLeaders: {
          personId: number
          name: string
          jerseyNum: string
          position: string
          teamTricode: string
          playerSlug?: string
          points: number
          rebounds: number
          assists: number
        }
      }
      pbOdds: {
        team: any
        odds: number
        suspended: number
      }
    }>
  }
}

export type LiveGame = ScoreboardResponse['scoreboard']['games'][number]
  
  export type IBoxscore = {
    meta: Meta
    game: Game
  }
  
  export type Meta = {
    version: number
    code: number
    request: string
    time: string
  }
  
  export type Game = {
    gameId: string
    gameTimeLocal: string
    gameTimeUTC: string
    gameTimeHome: string
    gameTimeAway: string
    gameEt: string
    duration: number
    gameCode: string
    gameStatusText: string
    gameStatus: number
    regulationPeriods: number
    period: number
    gameClock: string
    attendance: number
    sellout: string
    arena: Arena
    officials: Official[]
    homeTeam: HomeTeam
    awayTeam: AwayTeam
  }
  
  export type Arena = {
    arenaId: number
    arenaName: string
    arenaCity: string
    arenaState: string
    arenaCountry: string
    arenaTimezone: string
  }
  
  export type Official = {
    personId: number
    name: string
    nameI: string
    firstName: string
    familyName: string
    jerseyNum: string
    assignment: string
  }
  
  export type HomeTeam = {
    teamId: number
    teamName: string
    teamCity: string
    teamTricode: string
    score: number
    inBonus: string
    timeoutsRemaining: number
    periods: Period[]
    players: Player[]
    statistics: Statistics2
  }
  
  export type Period = {
    period: number
    periodType: string
    score: number
  }
  
  export type Player = {
    status: string
    order: number
    personId: number
    jerseyNum: string
    position?: string
    starter: string
    oncourt: string
    played: string
    statistics: Statistics
    name: string
    nameI: string
    firstName: string
    familyName: string
    notPlayingReason?: string
    notPlayingDescription?: string
  }
  
  export type Statistics = {
    assists: number
    blocks: number
    blocksReceived: number
    fieldGoalsAttempted: number
    fieldGoalsMade: number
    fieldGoalsPercentage: number
    foulsOffensive: number
    foulsDrawn: number
    foulsPersonal: number
    foulsTechnical: number
    freeThrowsAttempted: number
    freeThrowsMade: number
    freeThrowsPercentage: number
    minus: number
    minutes: string
    minutesCalculated: string
    plus: number
    plusMinusPoints: number
    points: number
    pointsFastBreak: number
    pointsInThePaint: number
    pointsSecondChance: number
    reboundsDefensive: number
    reboundsOffensive: number
    reboundsTotal: number
    steals: number
    threePointersAttempted: number
    threePointersMade: number
    threePointersPercentage: number
    turnovers: number
    twoPointersAttempted: number
    twoPointersMade: number
    twoPointersPercentage: number
  }
  
  export type Statistics2 = {
    assists: number
    assistsTurnoverRatio: number
    benchPoints: number
    biggestLead: number
    biggestLeadScore: string
    biggestScoringRun: number
    biggestScoringRunScore: string
    blocks: number
    blocksReceived: number
    fastBreakPointsAttempted: number
    fastBreakPointsMade: number
    fastBreakPointsPercentage: number
    fieldGoalsAttempted: number
    fieldGoalsEffectiveAdjusted: number
    fieldGoalsMade: number
    fieldGoalsPercentage: number
    foulsOffensive: number
    foulsDrawn: number
    foulsPersonal: number
    foulsTeam: number
    foulsTechnical: number
    foulsTeamTechnical: number
    freeThrowsAttempted: number
    freeThrowsMade: number
    freeThrowsPercentage: number
    leadChanges: number
    minutes: string
    minutesCalculated: string
    points: number
    pointsAgainst: number
    pointsFastBreak: number
    pointsFromTurnovers: number
    pointsInThePaint: number
    pointsInThePaintAttempted: number
    pointsInThePaintMade: number
    pointsInThePaintPercentage: number
    pointsSecondChance: number
    reboundsDefensive: number
    reboundsOffensive: number
    reboundsPersonal: number
    reboundsTeam: number
    reboundsTeamDefensive: number
    reboundsTeamOffensive: number
    reboundsTotal: number
    secondChancePointsAttempted: number
    secondChancePointsMade: number
    secondChancePointsPercentage: number
    steals: number
    threePointersAttempted: number
    threePointersMade: number
    threePointersPercentage: number
    timeLeading: string
    timesTied: number
    trueShootingAttempts: number
    trueShootingPercentage: number
    turnovers: number
    turnoversTeam: number
    turnoversTotal: number
    twoPointersAttempted: number
    twoPointersMade: number
    twoPointersPercentage: number
  }
  
  export type AwayTeam = {
    teamId: number
    teamName: string
    teamCity: string
    teamTricode: string
    score: number
    inBonus: string
    timeoutsRemaining: number
    periods: Period2[]
    players: Player2[]
    statistics: Statistics4
  }
  
  export type Period2 = {
    period: number
    periodType: string
    score: number
  }
  
  export type Player2 = {
    status: string
    order: number
    personId: number
    jerseyNum: string
    position?: string
    starter: string
    oncourt: string
    played: string
    statistics: Statistics3
    name: string
    nameI: string
    firstName: string
    familyName: string
  }
  
  export type Statistics3 = {
    assists: number
    blocks: number
    blocksReceived: number
    fieldGoalsAttempted: number
    fieldGoalsMade: number
    fieldGoalsPercentage: number
    foulsOffensive: number
    foulsDrawn: number
    foulsPersonal: number
    foulsTechnical: number
    freeThrowsAttempted: number
    freeThrowsMade: number
    freeThrowsPercentage: number
    minus: number
    minutes: string
    minutesCalculated: string
    plus: number
    plusMinusPoints: number
    points: number
    pointsFastBreak: number
    pointsInThePaint: number
    pointsSecondChance: number
    reboundsDefensive: number
    reboundsOffensive: number
    reboundsTotal: number
    steals: number
    threePointersAttempted: number
    threePointersMade: number
    threePointersPercentage: number
    turnovers: number
    twoPointersAttempted: number
    twoPointersMade: number
    twoPointersPercentage: number
  }
  
  export type Statistics4 = {
    assists: number
    assistsTurnoverRatio: number
    benchPoints: number
    biggestLead: number
    biggestLeadScore: string
    biggestScoringRun: number
    biggestScoringRunScore: string
    blocks: number
    blocksReceived: number
    fastBreakPointsAttempted: number
    fastBreakPointsMade: number
    fastBreakPointsPercentage: number
    fieldGoalsAttempted: number
    fieldGoalsEffectiveAdjusted: number
    fieldGoalsMade: number
    fieldGoalsPercentage: number
    foulsOffensive: number
    foulsDrawn: number
    foulsPersonal: number
    foulsTeam: number
    foulsTechnical: number
    foulsTeamTechnical: number
    freeThrowsAttempted: number
    freeThrowsMade: number
    freeThrowsPercentage: number
    leadChanges: number
    minutes: string
    minutesCalculated: string
    points: number
    pointsAgainst: number
    pointsFastBreak: number
    pointsFromTurnovers: number
    pointsInThePaint: number
    pointsInThePaintAttempted: number
    pointsInThePaintMade: number
    pointsInThePaintPercentage: number
    pointsSecondChance: number
    reboundsDefensive: number
    reboundsOffensive: number
    reboundsPersonal: number
    reboundsTeam: number
    reboundsTeamDefensive: number
    reboundsTeamOffensive: number
    reboundsTotal: number
    secondChancePointsAttempted: number
    secondChancePointsMade: number
    secondChancePointsPercentage: number
    steals: number
    threePointersAttempted: number
    threePointersMade: number
    threePointersPercentage: number
    timeLeading: string
    timesTied: number
    trueShootingAttempts: number
    trueShootingPercentage: number
    turnovers: number
    turnoversTeam: number
    turnoversTotal: number
    twoPointersAttempted: number
    twoPointersMade: number
    twoPointersPercentage: number
  }
  