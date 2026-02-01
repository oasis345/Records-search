'use client';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star, RefreshCw } from 'lucide-react';
import { useNavigation } from '@/app/hooks/useNavigation';
import { useSearchHistory } from '@/app/hooks/useSearchHistory';
import { User } from '../../model/user';

const ProfileCardContents = ({ user }: { user: User }) => {
  const { currentTitle } = useNavigation();
  const { isAlreadyAdded, toggleFavorite, setHistories, histories } = useSearchHistory();
  const item = { title: currentTitle, name: user.name, region: user.region, tag: user.tag, isFavorite: false };
  const isFavorite = isAlreadyAdded(item, 'favorite');

  useEffect(() => {
    if (!isAlreadyAdded(item, 'history')) setHistories([item, ...histories]);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={isFavorite ? 'default' : 'outline'}
        size="sm"
        onClick={() => toggleFavorite(item)}
        className={`transition-all ${isFavorite ? 'bg-yellow-500 hover:bg-yellow-600 border-yellow-500' : ''}`}
      >
        <Star className={`h-4 w-4 mr-1.5 ${isFavorite ? 'fill-current' : ''}`} />
        {isFavorite ? '즐겨찾기됨' : '즐겨찾기'}
      </Button>
      <Button variant="outline" size="sm" onClick={handleRefresh}>
        <RefreshCw className="h-4 w-4 mr-1.5" />
        새로고침
      </Button>
    </div>
  );
};

export default ProfileCardContents;
