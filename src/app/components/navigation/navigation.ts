export const navigation: NavigationModel = {
  menus: [
    {
      name: 'home',
      path: '/',
      label: '홈',
    },
  ],

  titles: [
    {
      name: 'lol',
      label: '리그오브레전드',
      menus: [],
    },
    {
      name: 'val',
      label: '발로란트',
      menus: [
        {
          name: 'val',
          path: '/val',
          label: '홈',
        },
        {
          name: 'leaderboards',
          path: '/val/leaderboards',
          label: '랭킹',
        },
      ],
    },
    { name: 'tft', label: '전략적 팀 전투', menus: [] },
  ],
};
