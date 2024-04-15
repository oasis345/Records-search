export type Stats = {
  name: string;
  tier: string | number;
  score: number;
  wins: number;
  losses: number;
};

export class GameStats {
  name: string;
  tier: string | number;
  score: number;
  wins: number;
  losses: number;

  constructor(stats: Stats) {
    const { name, score, tier, wins, losses, data } = stats;

    this.name = name;
    this.tier = tier;
    this.score = score;
    this.wins = wins;
    this.losses = losses;
  }
}
