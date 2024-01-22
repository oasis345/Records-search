export type Game = 'val' | 'tft' | 'lol' | 'apex' | 'fortnite' | 'pubg';

export const games: { key: Game; label: string; activated: boolean }[] = [
  {
    key: 'lol',
    label: 'League of Legends',
    activated: true,
  },
  {
    key: 'val',
    label: 'Valorant',
    activated: false,
  },
  {
    key: 'tft',
    label: 'Team Fight Tactics',
    activated: false,
  },
  {
    key: 'apex',
    label: 'Apex Legends',
    activated: false,
  },
  {
    key: 'fortnite',
    label: 'Fortnite',
    activated: false,
  },
  {
    key: 'pubg',
    label: 'BATTLEGROUNDs',
    activated: false,
  },
];
