type Stats = {
  name: string;
  tier: string | number;
  score: number;
  wins: number;
  losses: number;
};

export class DefaultGameStats {
  readonly name: string;
  readonly tier: string | number;
  readonly score: number;
  readonly wins: number;
  readonly losses: number;

  constructor(stats: Stats) {
    const { name, score, tier, wins, losses } = stats;

    this.name = name;
    this.tier = tier;
    this.score = score;
    this.wins = wins;
    this.losses = losses;
  }
}
