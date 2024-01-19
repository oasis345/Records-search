import { Game } from './interface';
import { LolStats } from '../lol/model/stats';
import { ValorantStats } from '../val/model/stats';

export function gameStatsToModel<T>(data: any, type: Game): T {
  switch (type) {
    case 'lol':
      const { leaguePoints, summonerName, tier, wins, losses } = data;
      return new LolStats(summonerName, tier, wins, losses, leaguePoints) as T;

    case 'tft':
      return data as T;

    case 'val':
      const { gameName, competitiveTier, leaderboardRank, numberOfWins, puuid, rankedRating, tagLine } = data;

      return new ValorantStats(
        leaderboardRank,
        gameName,
        competitiveTier,
        numberOfWins,
        puuid,
        rankedRating,
        tagLine
      ) as T;
  }
}
