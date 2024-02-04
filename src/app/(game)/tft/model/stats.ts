import { DefaultGameStats } from '../../model/stats';

type Stats = {
  summonerName: string;
  tier: string;
  wins: number;
  losses: number;
  leaguePoints: number;
};

export class TFTStats extends DefaultGameStats {
  constructor(tftStats: Stats) {
    const { leaguePoints, summonerName, tier, wins, losses } = tftStats;
    super({ name: summonerName, score: leaguePoints, wins, losses, tier });
  }
}
