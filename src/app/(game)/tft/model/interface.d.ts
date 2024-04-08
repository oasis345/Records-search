export interface ApiResource {
  champions: Record<string, any>;
  apiVersion: string;
}

export interface Match {
  metadata: Metadata;
  info: Info;
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
