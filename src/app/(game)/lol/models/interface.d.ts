export interface SummonerInfo {
  accountId: string;
  id: string;
  name: string;
  profileIconId: string;
  puuid: string;
  revisionDate: number;
  summonerLevel: number;
}

// TypeScript 형식의 JSON 정의

export interface Match {
  metadata: Metadata;
  info: Info;
}

interface Metadata {
  dataVersion: string;
  matchId: string;
  participants: string[];
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
  championName: string;
  riotIdGameName: string;
  item0: string;
  item1: string;
  item2: string;
  item3: string;
  item4: string;
  item5: string;
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
  // ... (기타 필드들)
}
