import { GameStats } from '../../shared/model/gameStats';

type Stats = {
  summonerId: string;
  tier: string;
  wins: number;
  losses: number;
  leaguePoints: number;
};

export class LoLStats extends GameStats {
  readonly losses: number;
  constructor(lolStats: Stats) {
    const { summonerId, tier, leaguePoints, wins, losses } = lolStats;

    super({
      name: summonerId,
      tier,
      score: leaguePoints,
      wins,
      losses,
    });

    this.losses = losses;
  }
}
