'use client';
import DropDown from '@/app/components/buttons/DropDown';
import SearchBar from '../../components/shared/SearchBar';
import { regions } from './model/regions';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/app/hooks/useNavigation';

export default function Page() {
  const [searchValue, setSearchValue] = React.useState('');
  const [region, setRegion] = React.useState('kr');
  const { router } = useNavigation();

  const onclick = async () => {
    router.push(`/lol/profile/${region}/${searchValue}`);
  };
  return (
    <div className="flex flex-col">
      <div className="flex">
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
    </div>
  );
}
