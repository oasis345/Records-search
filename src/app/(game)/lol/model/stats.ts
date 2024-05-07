import { GameStats } from '../../shared/model/gameStats';
import { RiotUser } from '../../shared/model/riot/interface';

export type Stats = {
  summonerId: string;
  tier: string;
  rank: string;
  wins: number;
  losses: number;
  leaguePoints: number;
};

export class LoLStats extends GameStats {
  constructor(
    lolStats: Stats,
    public user: RiotUser,
  ) {
    const { tier, leaguePoints, wins, losses } = lolStats;

    super({
      name: user.gameName,
      tier,
      score: leaguePoints,
      wins,
      losses,
      data: lolStats,
    });
  }
}
