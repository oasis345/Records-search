import React, { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Star, Trash } from 'lucide-react';
import { useNavigation } from '@/app/hooks/useNavigation';
import { searchHistoryState } from '@/app/store/searchHistoryState';
import { favoriteListState } from '@/app/store/favoriteListState';
import { SearchItem } from '@/app/types/interface';

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, placeholder, onChange, onKeyUp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [histories, setHistories] = useRecoilState(searchHistoryState);
  const [favorites, setFavorites] = useRecoilState(favoriteListState);
  const { router, currentTitle } = useNavigation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && !ref.current?.contains(event.target as Node)) setIsOpen(false);
    };

    window.addEventListener('mousedown', handleOutsideClick);

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [ref, isOpen]);

  const removeItemFromList = (
    list: SearchItem[],
    setList: React.Dispatch<React.SetStateAction<SearchItem[]>>,
    item: SearchItem,
  ) => {
    setList(list.filter((i) => i.name !== item.name));
  };

  const toggleFavoriteStatus = (item: SearchItem) => {
    const newList = isAlreadyAdded(item) ? favorites.filter((i) => i.name !== item.name) : [...favorites, item];
    setFavorites(newList);
  };

  const goToProfilePage = async (item: SearchItem) => {
    const { region, name, tag } = item;
    const searchText = tag ? `${name}#${tag}` : name;

    router.push(`/${currentTitle}/profile/${region}/${encodeURIComponent(searchText)}`);
  };

  const isAlreadyAdded = (item: SearchItem) => favorites.some((i) => i.name === item.name);

  const TabContentItem: React.FC<{
    item: SearchItem;
    onClick: () => void;
    buttons: React.ReactNode[];
  }> = ({ item, onClick, buttons }) => (
    <div
      className="flex items-center justify-between cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-500"
      onClick={onClick}
    >
      <p className="w-1/2 text-ellipsis overflow-hidden text-nowrap">{item.name}</p>
      <div className="flex">
        {buttons.map((button, index) => (
          <div key={index} className="ml-2">
            {button}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-96" ref={ref}>
      <Input
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyUp={(event) => onKeyUp?.(event)}
        value={value}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && !value && (
        <Card className="left-5 lg:left-auto md:left-auto absolute z-50" style={{ width: 'inherit' }}>
          <Tabs defaultValue="histories" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="histories">최근검색</TabsTrigger>
              <TabsTrigger value="Favorites">즐겨찾기</TabsTrigger>
            </TabsList>
            <TabsContent value="histories">
              <CardContent>
                {histories
                  .filter((item) => item.title === currentTitle)
                  .map((history) => (
                    <TabContentItem
                      key={history.name + history.region}
                      item={history}
                      onClick={() => goToProfilePage(history)}
                      buttons={[
                        <Button
                          key="favorite"
                          variant="ghost"
                          size="icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavoriteStatus(history);
                          }}
                        >
                          <Star className="h-4 w-4" style={{ color: isAlreadyAdded(history) ? 'red' : '' }} />
                        </Button>,
                        <Button
                          key="delete"
                          variant="ghost"
                          size="icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeItemFromList(histories, setHistories, history);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>,
                      ]}
                    />
                  ))}
              </CardContent>
            </TabsContent>
            <TabsContent value="Favorites">
              <CardContent>
                {favorites
                  .filter((item) => item.title === currentTitle)
                  .map((favorite) => (
                    <TabContentItem
                      key={favorite.name + favorite.region}
                      item={favorite}
                      onClick={() => goToProfilePage(favorite)}
                      buttons={[
                        <Button
                          key="delete"
                          variant="ghost"
                          size="icon"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeItemFromList(favorites, setFavorites, favorite);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>,
                        ,
                      ]}
                    />
                  ))}
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
