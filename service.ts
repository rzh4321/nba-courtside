import { format } from 'date-fns'

const service = {
  host : 'https://data.nba.net/prod/v1',
  
  getUrl(path: string) {
    return `${this.host}${path}`;
  },
  
  formatDate(date: Date) {
    return format(date, 'yyyyMMdd');
  },

  getLogoSrc(teamId: string) {
    return `https://cdn.nba.com/logos/nba/${teamId}/primary/L/logo.svg`;
  },

  getScoreboardPath(date: Date) {
    return `/${this.formatDate(date)}/scoreboard.json`;
  },

  async getScoreboard(date: Date) {
    const res = await fetch(this.getUrl(this.getScoreboardPath(date)));
    const data = await res.json();
    return data;
  },

  getBoxscorePath(date: Date, gameId: string) {
    return `/${this.formatDate(date)}/${gameId}_boxscore.json`;
  },

  async getBoxscore(date: Date, gameId: string) {
    const res = await fetch(this.getUrl(this.getBoxscorePath(date, gameId)));
    const data = await res.json();
    return data;
  }
}

export default service;
