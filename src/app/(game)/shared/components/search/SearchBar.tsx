import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Star, Trash } from 'lucide-react';
import { useNavigation } from '@/app/hooks/useNavigation';
import { useSearchHistory } from '@/app/hooks/useSearchHistory';
import { SearchItem } from '@/app/intrefaces/search/interface';

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, placeholder, onChange, onKeyUp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { router, currentTitle } = useNavigation();
  const { favorites, histories, isAlreadyAdded, remove, toggleFavorite, setHistories } = useSearchHistory();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && !ref.current?.contains(event.target as Node)) setIsOpen(false);
    };

    window.addEventListener('mousedown', handleOutsideClick);
    const initHistories = window.localStorage.getItem('histories');
    if (initHistories) setHistories(JSON.parse(initHistories));

    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [ref, isOpen]);

  const goToProfilePage = async (item: SearchItem) => {
    const { region, name, tag } = item;
    const searchText = tag ? `${name}#${tag}` : name;

    router.push(`/${currentTitle}/profile/${region}/${encodeURIComponent(searchText)}`);
  };

  const TabContentItem: React.FC<{
    item: SearchItem;
    buttons: React.ReactNode[];
    onClick: () => void;
  }> = ({ item, onClick, buttons }) => {
    const { tag, region, name } = item;

    return (
      <li
        className="flex items-center w-full justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500"
        onClick={onClick}
      >
        <p className="w-full text-ellipsis overflow-hidden text-nowrap">
          {region && <span className="px-1 py-2 bg-sky-300 font-bold uppercase text-sm text-white">{region}</span>}
          <span className="px-1">{name}</span>
          {tag && <span className="text-gray-400">{`#${tag}`}</span>}
        </p>
        <div className="flex">
          {buttons.map((button, index) => (
            <div key={index} className="ml-2">
              {button}
            </div>
          ))}
        </div>
      </li>
    );
  };

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
                <ul className="w-full">
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
                              toggleFavorite(history);
                            }}
                          >
                            <Star
                              className="h-4 w-4"
                              style={{ color: isAlreadyAdded(history, 'favorite') ? 'red' : '' }}
                            />
                          </Button>,
                          <Button
                            key="delete"
                            variant="ghost"
                            size="icon"
                            onClick={(event) => {
                              event.stopPropagation();
                              remove(history, 'history');
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>,
                        ]}
                      />
                    ))}
                </ul>
              </CardContent>
            </TabsContent>
            <TabsContent value="Favorites">
              <CardContent>
                <ul className="w-full">
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
                              remove(favorite, 'favorite');
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>,
                          ,
                        ]}
                      />
                    ))}
                </ul>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
