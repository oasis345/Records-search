'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRecoilState } from 'recoil';
import { searchHistories, SearchHistories } from '@/app/store/searchHistories';
import { favoriteList } from '@/app/store/favoriteList';
import { Button } from '@/components/ui/button';
import { Star, Trash } from 'lucide-react';
import { useNavigation } from '@/app/hooks/useNavigation';

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
  const [histories, setHistories] = useRecoilState(searchHistories);
  const [favorites, setFavorites] = useRecoilState(favoriteList);
  const { router } = useNavigation();

  const CONTENTS_CLASS_NAME = 'flex items-center justify-between w-full hover:bg-gray-100 dark:hover:bg-gray-500';

  const onSearch = (event) => {
    const value = event.target.value;
    onChange(value);
  };

  const removeItem = (list: SearchHistories[], setList: any, item: SearchHistories) => {
    const newList = list.filter((i) => i.name !== item.name);
    setList(newList);
  };

  const addFavorites = (history: SearchHistories) => {
    setFavorites([...favorites, history]);
  };

  const onclick = async (history: SearchHistories) => {
    const { region, name } = history;
    router.push(`/lol/profile/${region}/${name}`);
  };

  return (
    <div className="w-96">
      <Input placeholder={placeholder} onChange={onSearch} value={value} onFocus={() => setIsOpen(true)} />
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
                  <div key={history.name + history.region} className={CONTENTS_CLASS_NAME}>
                    <p onClick={() => onclick(history)}>{history.name}</p>
                    <div>
                      <Button variant="ghost" size="icon" onClick={() => addFavorites(history)}>
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(histories, setHistories, history)}>
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
                  <div key={favorite.name + favorite.region} className={CONTENTS_CLASS_NAME}>
                    <p onClick={() => onclick(favorite)}>{favorite.name}</p>
                    <div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(favorites, setFavorites, favorite)}>
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
