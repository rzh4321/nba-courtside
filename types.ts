export type IScoreboard = {
    _internal: {
      pubDateTime: string
      igorPath: string
      routeName: string
      routeValue: string
      xslt: string
      xsltForceRecompile: string
      xsltInCache: string
      xsltCompileTimeMillis: string
      xsltTransformTimeMillis: string
      consolidatedDomKey: string
      endToEndTimeMillis: string
    }
    numGames: number
    games: Array<{
      seasonStageId: number
      seasonYear: string
      leagueName: string
      gameId: string
      arena: {
        name: string
        isDomestic: boolean
        city: string
        stateAbbr: string
        country: string
      }
      isGameActivated: boolean
      statusNum: number
      extendedStatusNum: number
      startTimeEastern: string
      startTimeUTC: string
      endTimeUTC: string
      startDateEastern: string
      homeStartDate: string
      homeStartTime: string
      visitorStartDate: string
      visitorStartTime: string
      gameUrlCode: string
      clock: string
      isBuzzerBeater: boolean
      isPreviewArticleAvail: boolean
      isRecapArticleAvail: boolean
      nugget: {
        text: string
      }
      attendance: string
      tickets: {
        mobileApp: string
        desktopWeb: string
        mobileWeb: string
        leagGameInfo: string
        leagTix: string
      }
      hasGameBookPdf: boolean
      isStartTimeTBD: boolean
      isNeutralVenue: boolean
      gameDuration: {
        hours: string
        minutes: string
      }
      tags: Array<string>
      playoffs: {
        roundNum: string
        confName: string
        seriesId: string
        seriesSummaryText: string
        isSeriesCompleted: boolean
        gameNumInSeries: string
        isIfNecessary: boolean
        vTeam: {
          seedNum: string
          seriesWin: string
          isSeriesWinner: boolean
        }
        homeTeam: {
          seedNum: string
          seriesWin: string
          isSeriesWinner: boolean
        }
      }
      period: {
        current: number
        type: number
        maxRegular: number
        isHalftime: boolean
        isEndOfPeriod: boolean
      }
      awayTeam: {
        teamId: string
        teamtriCode: string
        win: string
        loss: string
        seriesWin: string
        seriesLoss: string
        score: string
        linescore: Array<{
          score: string
        }>
      }
      homeTeam: {
        teamId: string
        teamtriCode: string
        win: string
        loss: string
        seriesWin: string
        seriesLoss: string
        score: string
        linescore: Array<{
          score: string
        }>
      }
      watch: {
        broadcast: {
          broadcasters: {
            national: Array<{
              shortName: string
              longName: string
            }>
            canadian: Array<{
              shortName: string
              longName: string
            }>
            vTeam: Array<any>
            hTeam: Array<any>
            spanish_hTeam: Array<any>
            spanish_vTeam: Array<any>
            spanish_national: Array<any>
          }
          video: {
            regionalBlackoutCodes: string
            canPurchase: boolean
            isLeaguePass: boolean
            isNationalBlackout: boolean
            isTNTOT: boolean
            isVR: boolean
            tntotIsOnAir: boolean
            isNextVR: boolean
            isNBAOnTNTVR: boolean
            isMagicLeap: boolean
            isOculusVenues: boolean
            streams: Array<{
              streamType: string
              isOnAir: boolean
              doesArchiveExist: boolean
              isArchiveAvailToWatch: boolean
              streamId: string
              duration: number
            }>
            deepLink: Array<{
              broadcaster: string
              regionalMarketCodes: string
              iosApp: string
              androidApp: string
              desktopWeb: string
              mobileWeb: string
            }>
          }
          audio: {
            national: {
              streams: Array<{
                language: string
                isOnAir: boolean
                streamId: string
              }>
              broadcasters: Array<any>
            }
            vTeam: {
              streams: Array<{
                language: string
                isOnAir: boolean
                streamId: string
              }>
              broadcasters: Array<{
                shortName: string
                longName: string
              }>
            }
            hTeam: {
              streams: Array<{
                language: string
                isOnAir: boolean
                streamId: string
              }>
              broadcasters: Array<{
                shortName: string
                longName: string
              }>
            }
          }
        }
      }
    }>
  }
  
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
  