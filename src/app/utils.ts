import { DefaultGameStats } from './(game)/gameStats';
import { Game } from './(game)/interface';
import { ValorantStats } from './(game)/val/stats';

export function gameStatsToModel<T>(data: DefaultGameStats, type: Game): T {
  switch (type) {
    case 'lol':
      return data as T;

    case 'tft':
      return data as T;

    case 'val':
      const { gameName, competitiveTier, leaderboardRank, numberOfWins, puuid, rankedRating, tagLine } = data;

      return new ValorantStats(
        gameName,
        competitiveTier,
        leaderboardRank,
        numberOfWins,
        puuid,
        rankedRating,
        tagLine
      ) as T;
  }
}
