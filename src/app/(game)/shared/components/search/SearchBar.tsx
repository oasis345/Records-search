import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Star, Trash, Search, Clock, History } from 'lucide-react';
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

  const filteredHistories = histories.filter((item) => item.title === currentTitle);
  const filteredFavorites = favorites.filter((item) => item.title === currentTitle);

  const TabContentItem: React.FC<{
    item: SearchItem;
    buttons: React.ReactNode[];
    onClick: () => void;
  }> = ({ item, onClick, buttons }) => {
    const { tag, region, name } = item;

    return (
      <li
        className="flex items-center w-full justify-between cursor-pointer hover:bg-accent/50 p-2.5 rounded-lg transition-all duration-200 group"
        onClick={onClick}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {region && (
            <span className="px-2 py-1 bg-primary/10 text-primary font-semibold uppercase text-xs rounded-md shrink-0">
              {region}
            </span>
          )}
          <span className="text-foreground font-medium truncate">{name}</span>
          {tag && <span className="text-muted-foreground text-sm shrink-0">#{tag}</span>}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {buttons.map((button, index) => (
            <div key={index}>{button}</div>
          ))}
        </div>
      </li>
    );
  };

  const EmptyState: React.FC<{ icon: React.ReactNode; message: string }> = ({ icon, message }) => (
    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
      {icon}
      <p className="text-sm mt-2">{message}</p>
    </div>
  );

  return (
    <div className="w-full relative" ref={ref}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyUp={(event) => onKeyUp?.(event)}
          value={value}
          onFocus={() => setIsOpen(true)}
          className="pl-10 h-11 bg-background border-input focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
      {isOpen && !value && (
        <Card className="absolute left-0 right-0 top-full mt-2 z-50 shadow-xl border animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <Tabs defaultValue="histories" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50">
              <TabsTrigger value="histories" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Clock className="w-3.5 h-3.5" />
                최근검색
              </TabsTrigger>
              <TabsTrigger value="Favorites" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Star className="w-3.5 h-3.5" />
                즐겨찾기
              </TabsTrigger>
            </TabsList>
            <TabsContent value="histories" className="mt-0">
              <CardContent className="p-2">
                {filteredHistories.length > 0 ? (
                  <ul className="space-y-1 max-h-64 overflow-y-auto">
                    {filteredHistories.map((history) => (
                      <TabContentItem
                        key={history.name + history.region}
                        item={history}
                        onClick={() => goToProfilePage(history)}
                        buttons={[
                          <Button
                            key="favorite"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-yellow-500/10"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleFavorite(history);
                            }}
                          >
                            <Star
                              className={`h-4 w-4 transition-colors ${
                                isAlreadyAdded(history, 'favorite')
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-muted-foreground hover:text-yellow-500'
                              }`}
                            />
                          </Button>,
                          <Button
                            key="delete"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10"
                            onClick={(event) => {
                              event.stopPropagation();
                              remove(history, 'history');
                            }}
                          >
                            <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>,
                        ]}
                      />
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={<History className="w-10 h-10 text-muted-foreground/50" />}
                    message="최근 검색 기록이 없습니다"
                  />
                )}
              </CardContent>
            </TabsContent>
            <TabsContent value="Favorites" className="mt-0">
              <CardContent className="p-2">
                {filteredFavorites.length > 0 ? (
                  <ul className="space-y-1 max-h-64 overflow-y-auto">
                    {filteredFavorites.map((favorite) => (
                      <TabContentItem
                        key={favorite.name + favorite.region}
                        item={favorite}
                        onClick={() => goToProfilePage(favorite)}
                        buttons={[
                          <Button
                            key="delete"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10"
                            onClick={(event) => {
                              event.stopPropagation();
                              remove(favorite, 'favorite');
                            }}
                          >
                            <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                          </Button>,
                        ]}
                      />
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={<Star className="w-10 h-10 text-muted-foreground/50" />}
                    message="즐겨찾기한 플레이어가 없습니다"
                  />
                )}
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
