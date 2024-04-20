export class GameStats {
  name: string;
  tier: string | number;
  score: number;
  wins: number;
  losses?: number;
  data?: any;

  constructor(stats: GameStats) {
    const { name, score, tier, wins, losses, data } = stats;

    this.name = name;
    this.tier = tier;
    this.score = score;
    this.wins = wins;
    this.losses = losses;
    this.data = data;
  }
}
