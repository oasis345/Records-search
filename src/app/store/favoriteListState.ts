import { atom } from 'recoil';
import { localStorageEffect } from './utils';
import { SearchItem } from '../types/interface';

export const favoriteListState = atom<SearchItem[]>({
  key: 'favoriteListState',
  default: [],
  effects: [localStorageEffect('favorites')],
});
