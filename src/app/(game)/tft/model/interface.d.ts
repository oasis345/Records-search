export interface ApiResource {
  champions: Record<string, any>;
  apiVersion: string;
}

export interface Match {
  metadata: Metadata;
  info: Info;
  user: Participant;
}

interface Metadata {
  data_version: string;
  match_id: string;
  participants: string[];
}

interface Info {
  game_datetime: number;
  game_length: number;
  game_variation: string;
  game_version: string;
  participants: Participant[];
  queue_id: number;
  tft_set_number: number;
  tft_game_type: string;
}

export interface Participant {
  companion: Companion;
  gold_left: number;
  last_round: number;
  level: number;
  placement: number;
  players_eliminated: number;
  puuid: string;
  time_eliminated: number;
  total_damage_to_players: number;
  traits: Trait[];
  units: Unit[];
}

interface Companion {
  // Define Companion properties here
}

interface Trait {
  name: string;
  num_units: number;
  style: number;
  tier_current: number;
  tier_total: number;
}

interface Unit {
  items: number[];
  character_id: string;
  chosen: string | null;
  name: string;
  rarity: number;
  tier: number;
}

interface MiniSeries {
  wins: number; // 미니 시리즈에서의 승리 횟수
  losses: number; // 미니 시리즈에서의 패배 횟수
  target: number; // 승급을 위해 필요한 승리 횟수
  progress: string; // 현재 미니 시리즈 진행 상태를 나타내는 문자열
}

interface LeagueItem {
  freshBlood: boolean;
  wins: number; // 1등 횟수
  miniSeries?: MiniSeries; // 미니 시리즈 정보, 선택적으로 존재할 수 있음
  inactive: boolean;
  veteran: boolean;
  hotStreak: boolean;
  rank: string;
  leaguePoints: number;
  losses: number; // 2등부터 8등까지 횟수
  summonerId: string; // 플레이어의 암호화된 소환사 ID
}

interface LeagueList {
  leagueId: string;
  entries: LeagueItem[];
  tier: string;
  name: string;
  queue: string;
}
