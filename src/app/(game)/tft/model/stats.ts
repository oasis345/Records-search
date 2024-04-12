import { GameStats } from '../../shared/model/gameStats';

type Stats = {
  summonerId: string;
  rank: string;
  wins: number;
  losses: number;
  leaguePoints: number;
};

export class TFTStats extends GameStats {
  constructor(tftStats: Stats) {
    const { leaguePoints, summonerId, rank, wins, losses } = tftStats;
    super({ name: summonerId, score: leaguePoints, wins, losses, tier: rank });
  }
}
