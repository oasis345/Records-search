export interface ApiResource {
  spells: Record<string, any>;
  champions: Record<string, any>;
  apiVersion: string;
}

export interface Match {
  metadata: Metadata;
  info: Info;
  user: Participant;
}

interface Metadata {
  dataVersion: string;
  matchId: string;
  participants: string[];
}

export interface TeamStats {
  totalKills: number;
  totalAssists: number;
  totalDeaths: number;
}

interface Info {
  gameCreation: number;
  gameDuration: number;
  gameEndTimestamp?: number;
  gameId: number;
  gameMode: string;
  gameName: string;
  gameStartTimestamp: number;
  gameType: string;
  gameVersion: string;
  mapId: number;
  participants: Participant[];
  platformId: string;
  queueId: number;
  teams: Team[];
  tournamentCode: string;
}

export interface Participant {
  assists: number;
  kills: number;
  deaths: number;
  puuid: string;
  win?: boolean;
  teamId: number;
  playerSubteamId: number;
  championName: string;
  champLevel: number;
  riotIdGameName: string;
  riotIdTagline: string;
  summonerName: string;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  totalMinionsKilled: number;
  item0: string;
  item1: string;
  item2: string;
  item3: string;
  item4: string;
  item5: string;
  summoner1Id: number;
  summoner2Id: number;
  perks: Perks;
  objectives: Objectives;
  baron: Objective;
  champion: Objective;
  dragon: Objective;
  inhibitor: Objective;
  riftHerald: Objective;
  tower: Objective;
}

interface Perks {
  statPerks: PerkStats;
  styles: PerkStyle[];
}

interface PerkStats {
  defense: number;
  flex: number;
  offense: number;
}

interface PerkStyle {
  description: string;
  selections: PerkStyleSelection[];
  style: number;
}

interface PerkStyleSelection {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

interface Team {
  bans: Ban[];
  objectives: Objectives;
  teamId: number;
  win: boolean;
}

interface Ban {
  championId: number;
  pickTurn: number;
}

interface Objectives {
  baron: Objective;
  champion: Objective;
  dragon: Objective;
  inhibitor: Objective;
  riftHerald: Objective;
  tower: Objective;
}

interface Objective {
  first: boolean;
  kills: number;
}

interface MiniSeries {
  wins: number; // Number of wins in the mini series
  losses: number; // Number of losses in the mini series
  target: number; // Number of wins required for promotion
  progress: string; // String showing the current progress in the mini series
}

export interface LeagueEntry {
  leagueId?: string;
  summonerId?: string; // Player's summonerId (Encrypted)
  puuid: string; // Player's puuid (Encrypted)
  queueType?: string;
  tier?: string;
  rank?: string; // The player's division within a tier
  leaguePoints: number;
  wins: number; // Winning team on Summoners Rift. First placement in Teamfight Tactics
  losses: number; // Losing team on Summoners Rift. Second through eighth placement in Teamfight Tactics
  hotStreak?: boolean;
  veteran?: boolean;
  freshBlood?: boolean;
  inactive?: boolean;
  summonerName?: string;
  miniSeries?: MiniSeries; // Mini series details, optional as it might not always be present
}

// 상위 티어 (Challenger, Grandmaster, Master) API 응답
export interface LeagueList {
  leagueId: string;
  tier: string;
  name: string;
  queue: string;
  entries: LeagueEntry[];
}
