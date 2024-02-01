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
      menus: [
        {
          name: '/',
          href: '/lol',
          label: '홈',
        },
        {
          name: 'leaderboards',
          href: '/lol/leaderboards',
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
          name: 'leaderboards',
          href: '/val/leaderboards',
          label: '랭킹',
        },
      ],
      activated: false,
    },
    {
      name: 'tft',
      label: 'Team Fight Tactics',
      href: '/tft',
      menus: [],
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
    {
      name: 'pubg',
      label: 'Battle Grounds',
      href: '/pubg',
      menus: [],
      activated: false,
    },
  ],
};
