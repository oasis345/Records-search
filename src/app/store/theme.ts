import { atom } from 'recoil';

export const themeState = atom<Theme>({
  key: 'themeState ',
  default: 'light',
});
