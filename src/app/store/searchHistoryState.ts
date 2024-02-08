import { atom, selector } from 'recoil';
import { localStorageEffect } from './utils';
import { SearchItem } from '../types/interface';

export const searchHistoryState = atom<SearchItem[]>({
  key: 'searchHistoryState',
  default: [],
  effects: [localStorageEffect('histories')],
});

export const favoriteListState = selector({
  key: 'favoriteListState',
  get: ({ get }) => {
    const histories = get(searchHistoryState);
    return histories.filter((history) => history.isFavorite);
  },
});
