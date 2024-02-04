import { DefaultGameStats } from '../../model/gameStats';

export class LolStats extends DefaultGameStats {
  constructor(
    public summonerName: string,
    public tier: string,
    public wins: number,
    public losses: number,
    public leaguePoints: number,
  ) {
    super(summonerName, tier, leaguePoints, wins);
  }
}
