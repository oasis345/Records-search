'use client';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { StarIcon } from '@radix-ui/react-icons';
import { useNavigation } from '@/app/hooks/useNavigation';
import { useRecoilState } from 'recoil';
import { SearchItem } from '@/app/types/interface';
import { searchHistoryState } from '@/app/store/searchHistoryState';

const ProfileCardContents = ({ name, region, tag }: { name: string; region: string; tag?: string }) => {
  const { currentTitle } = useNavigation();
  const [histories, setHistories] = useRecoilState<SearchItem[]>(searchHistoryState);

  useEffect(() => {
    if (!histories.find((item) => item.name === name))
      setHistories([...histories, { title: currentTitle, name: name, region, tag }]);
  }, []);

  return (
    <div className="flex items-center">
      <Button className="w-20 mr-1">
        <p>Update</p>
      </Button>
      <Button>
        <StarIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProfileCardContents;
