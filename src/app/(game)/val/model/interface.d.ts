export interface Act {
  id: string;
  isActive: boolean;
  name: string;
  parentId: string;
  type: 'episode' | 'act';
}

export interface Player {
  competitiveTier: number;
  gameName: string;
  leaderboardRank: number;
  numberOfWins: number;
  puuid: string;
  rankedRating: number;
  tagLine: string;
}
