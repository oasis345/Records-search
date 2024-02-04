export class DefaultGameStats {
  constructor(
    public name: string,
    public tier: string | number,
    public score: number,
    public totalWins: number,
  ) {}
}
