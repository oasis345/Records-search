'use client';
import DropDown from '@/app/components/buttons/DropDown';
import SearchBar from '@/app/components/shared/SearchBar';
import { regions } from './models/regions';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/app/hooks/useNavigation';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default function Page() {
  const [searchValue, setSearchValue] = React.useState('');
  const [region, setRegion] = React.useState('kr');
  const { router } = useNavigation();

  const onclick = async () => {
    router.push(`/lol/profile/${region}/${searchValue}`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-5">
        <DropDown
          data={regions}
          value={region}
          keyField={'name'}
          labelField={'label'}
          onSelect={(selectedItem: string) => {
            setRegion(selectedItem);
          }}
        ></DropDown>
        <SearchBar value={searchValue} onChange={setSearchValue} placeholder={'플레이어 이름'} />
        <Button onClick={onclick}>검색</Button>
      </div>
      <AspectRatio ratio={16 / 9}>
        <Image fill src="/lol_main.jpg" alt="Image" className="rounded-md" priority />
      </AspectRatio>
    </div>
  );
}
