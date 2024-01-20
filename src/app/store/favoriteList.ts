import { atom } from 'recoil';
import { SearchHistories } from './searchHistories';
import { localStorageEffect } from './utils';

export const favoriteList = atom<SearchHistories[]>({
  key: 'favoriteList',
  default: [],
  effects: [localStorageEffect('favorites')],
});
