import { DefaultGameStats } from '../gameStats';

export class ValorantStats extends DefaultGameStats {
  constructor(
    public gameName: string,
    public competitiveTier: number,
    public leaderboardRank: number,
    public numberOfWins: number,
    public puuid: string,
    public rankedRating: number,
    public tagLine: string
  ) {
    super(leaderboardRank, gameName, competitiveTier, rankedRating, numberOfWins);
  }
}
