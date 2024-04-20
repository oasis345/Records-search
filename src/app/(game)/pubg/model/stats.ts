import { GameStats } from '../../shared/model/gameStats';

type Stats = {
  attributes: {
    name: string;
    rank: number;
    stats: any;
    averageDamage: number;
    kda: number;
  };
  id: string;
};

export class PubgStats extends GameStats {
  constructor(pubgStats: Stats) {
    const { attributes } = pubgStats;

    super({
      name: attributes.name,
      tier: attributes.stats.tier,
      score: attributes.stats.rankPoints,
      wins: attributes.stats.wins,
      data: pubgStats,
    });
  }
}
