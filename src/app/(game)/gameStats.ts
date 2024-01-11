export class DefaultGameStats {
  constructor(
    public rank: number,
    public name: string,
    public tier: string | number,
    public score: number,
    public totalWins: number
  ) {}
}
