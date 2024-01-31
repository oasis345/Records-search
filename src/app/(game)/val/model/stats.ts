import { DefaultGameStats } from '../../model/gameStats';

export class ValorantStats extends DefaultGameStats {
  constructor(
    public leaderboardRank: number,
    public gameName: string,
    public competitiveTier: number,
    public numberOfWins: number,
    public puuid: string,
    public rankedRating: number,
    public tagLine: string
  ) {
    super(gameName, competitiveTier, rankedRating, numberOfWins);
  }
}
