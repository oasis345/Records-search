import { GameStats } from '../../shared/model/gameStats';
import { RiotUser } from '../../shared/model/riot/interface';

type Stats = {
  summonerId: string;
  tier: string;
  wins: number;
  losses: number;
  leaguePoints: number;
};

export class TFTStats extends GameStats {
  constructor(
    tftStats: Stats,
    public user: RiotUser,
  ) {
    const { leaguePoints, tier, wins, losses } = tftStats;
    super({ name: user?.gameName, score: leaguePoints, wins, losses, tier, data: tftStats });
  }
}
