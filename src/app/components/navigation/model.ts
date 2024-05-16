import { Navigation } from './interface';

export const navigation: Navigation = {
  menus: [
    {
      name: 'home',
      href: '/',
      label: '홈',
    },
  ],

  titles: [
    {
      name: 'lol',
      label: 'League of legends',
      href: '/lol',
      icon: 'lol-logo.svg',
      menus: [
        {
          name: '/',
          href: '/lol',
          label: '홈',
        },
        {
          name: 'leaderboard',
          href: '/lol/leaderboard',
          label: '랭킹',
        },
      ],
      activated: true,
    },
    {
      name: 'pubg',
      label: 'Battle Grounds',
      href: '/pubg',
      icon: 'pubg-logo.svg',
      menus: [
        {
          name: '/',
          href: '/pubg',
          label: '홈',
        },
        {
          name: 'leaderboard',
          href: '/pubg/leaderboard',
          label: '랭킹',
        },
      ],
      activated: true,
    },
    {
      name: 'tft',
      label: 'Teamfight Tactics',
      href: '/tft',
      icon: 'tft-logo.svg',
      menus: [
        {
          name: '/',
          href: '/tft',
          label: '홈',
        },
        {
          name: 'leaderboard',
          href: '/tft/leaderboard',
          label: '랭킹',
        },
      ],
      activated: true,
    },
    {
      name: 'val',
      label: 'Valorant',
      href: '/val',
      menus: [
        {
          name: '/',
          href: '/val',
          label: '홈',
        },
        {
          name: 'leaderboard',
          href: '/val/leaderboard',
          label: '랭킹',
        },
      ],
      activated: false,
    },
    {
      name: 'apex',
      label: 'Apex Legends',
      href: '/apex',
      menus: [],
      activated: false,
    },
    {
      name: 'fortnite',
      label: 'Fortnite',
      href: '/fortnite',
      menus: [],
      activated: false,
    },
  ],
};
