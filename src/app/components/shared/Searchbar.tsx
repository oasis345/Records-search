'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRecoilState } from 'recoil';
import { searchHistoryState } from '@/app/store/searchHistoryState';
import { favoriteListState } from '@/app/store/favoriteListState';
import { Button } from '@/components/ui/button';
import { Star, Trash } from 'lucide-react';
import { useNavigation } from '@/app/hooks/useNavigation';
import { SearchItem } from '@/app/type/interface';

export default function SearchBar({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [histories, setHistories] = useRecoilState(searchHistoryState);
  const [favorites, setFavorites] = useRecoilState(favoriteListState);
  const { router } = useNavigation();

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    onChange(value);
  };

  const removeItemFromList = (list: SearchItem[], setList: any, item: SearchItem) => {
    const newList = list.filter((i) => i.name !== item.name);
    setList(newList);
  };

  const toggleFavoriteStatus = (history: SearchItem) => {
    if (!isAlreadyAdded(history)) setFavorites([...favorites, history]);
    else removeItemFromList(favorites, setFavorites, history);
  };

  const goToProfile = async (history: SearchItem) => {
    const { region, name } = history;
    router.push(`/lol/profile/${region}/${name}`);
  };

  const isAlreadyAdded = (history: SearchItem): boolean => {
    return !!favorites.find((item) => item.name === history.name);
  };

  const historyItemClassName =
    'flex items-center justify-between cursor-pointer w-full hover:bg-gray-100 dark:hover:bg-gray-500';

  return (
    <div className="w-96">
      <Input
        placeholder={placeholder}
        onChange={handleSearchInputChange}
        value={value}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <Card className="absolute z-50" style={{ width: 'inherit' }}>
          <Tabs defaultValue="histories" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="histories">최근검색</TabsTrigger>
              <TabsTrigger value="Favorites">즐겨찾기</TabsTrigger>
            </TabsList>
            <TabsContent value="histories">
              <CardContent>
                {histories.map((history) => (
                  <div key={history.name + history.region} className={historyItemClassName}>
                    <p onClick={() => goToProfile(history)}>{history.name}</p>
                    <div>
                      <Button variant="ghost" size="icon" onClick={() => toggleFavoriteStatus(history)}>
                        <Star className="h-4 w-4" style={{ color: isAlreadyAdded(history) ? 'red' : 'black' }} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItemFromList(histories, setHistories, history)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </TabsContent>
            <TabsContent value="Favorites">
              <CardContent>
                {favorites.map((favorite) => (
                  <div key={favorite.name + favorite.region} className={historyItemClassName}>
                    <p onClick={() => goToProfile(favorite)}>{favorite.name}</p>
                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItemFromList(favorites, setFavorites, favorite)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}
