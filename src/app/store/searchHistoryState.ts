import { atom } from 'recoil';
import { localStorageEffect } from './utils';
import { SearchItem } from '../types/interface';

export const searchHistoryState = atom<SearchItem[]>({
  key: 'searchHistoryState',
  default: [],
  effects: [localStorageEffect('histories')],
});
