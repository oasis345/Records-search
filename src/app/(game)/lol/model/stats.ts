import { DefaultGameStats } from '../../model/stats';

type Stats = {
  summonerName: string;
  tier: string;
  wins: number;
  losses: number;
  leaguePoints: number;
};

export class LoLStats extends DefaultGameStats {
  readonly losses: number;
  constructor(lolStats: Stats) {
    const { summonerName, tier, leaguePoints, wins, losses } = lolStats;

    super({
      name: summonerName,
      tier,
      score: leaguePoints,
      wins,
      losses,
    });

    this.losses = losses;
  }
}
