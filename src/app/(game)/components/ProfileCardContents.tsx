'use client';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useNavigation } from '@/app/hooks/useNavigation';
import { useSearchHistory } from '@/app/hooks/useSearchHistory';

const ProfileCardContents = ({ name, region, tag }: { name: string; region: string; tag?: string }) => {
  const { currentTitle } = useNavigation();
  const { isAlreadyAdded, toggleFavorite, setHistories, histories } = useSearchHistory();
  const item = { title: currentTitle, name: name, region, tag, isFavorite: false };

  useEffect(() => {
    if (!isAlreadyAdded(item, 'history')) setHistories([item, ...histories]);
  }, []);

  return (
    <div className="flex items-center">
      <Button onClick={() => toggleFavorite(item)}>
        <Star className="h-4 w-4" style={{ color: isAlreadyAdded(item, 'favorite') ? 'red' : '' }} />
        즐겨찾기
      </Button>
    </div>
  );
};

export default ProfileCardContents;
