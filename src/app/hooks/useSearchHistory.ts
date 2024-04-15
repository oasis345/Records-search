import { useRecoilState, useRecoilValue } from 'recoil';
import { searchHistoryState, favoriteListState } from '../store/searchHistoryState';
import _ from 'lodash';
import { SearchItem } from '../intrefaces/search/interface';

type SearchType = 'history' | 'favorite';

export const useSearchHistory = () => {
  const [histories, setHistories] = useRecoilState(searchHistoryState);
  const favorites = useRecoilValue(favoriteListState);
  const titleWithName = (item: SearchItem) => item.title + item.name + item.tag;

  const isAlreadyAdded = (item: SearchItem, type: SearchType) => {
    const list = type === 'history' ? histories : favorites;
    return list.some((listItem: SearchItem) => titleWithName(listItem) === titleWithName(item));
  };

  const toggleFavorite = (item: SearchItem) => {
    const index = histories.findIndex((history) => titleWithName(history) === titleWithName(item));
    const newList = _.cloneDeep(histories);

    newList[index].isFavorite = !newList[index].isFavorite;
    setHistories(newList);
  };

  const remove = (item: SearchItem, type: SearchType) => {
    if (type === 'favorite') toggleFavorite(item);
    else setHistories(histories.filter((i: SearchItem) => titleWithName(i) !== titleWithName(item)));
  };

  return {
    searchHistoryState,
    histories,
    favorites,
    setHistories,
    isAlreadyAdded,
    toggleFavorite,
    remove,
  };
};
