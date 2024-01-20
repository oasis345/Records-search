import { atom } from 'recoil';
import { localStorageEffect } from './utils';

export type SearchHistories = {
  region: string;
  name: string;
};

export const searchHistories = atom<SearchHistories[]>({
  key: 'searchHistories',
  default: [],
  effects: [localStorageEffect('histories')],
});
