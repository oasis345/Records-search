'use client';
import DropDown from '@/app/components/buttons/DropDown';
import SearchBar from '@/app/(game)/components/SearchBar';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dict } from '../types/interface';
import { useNavigation } from '../hooks/useNavigation';

export default function TitleBanner({
  selectItems,
  selectedItem,
  keyField,
  labelField,
  placeholder,
}: {
  selectItems: Dict[];
  selectedItem?: any;
  keyField: string;
  labelField?: string;
  placeholder?: string;
}) {
  const [searchValue, setSearchValue] = React.useState('');
  const [region, setRegion] = React.useState(selectedItem);
  const { router, currentTitle } = useNavigation();

  const goToProfilePage = async () => {
    router.push(`/${currentTitle}/profile/${region}/${encodeURIComponent(searchValue)}`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex flex-col h-80 items-center justify-center">
        <Image fill src={`/${currentTitle}_main.jpg`} alt="Image" priority className="relative object-cover" />
        <p className="relative text-6xl font-bold z-1 bottom-10">logo</p>
        <div className="relative w-full px-5 flex justify-center z-1">
          <DropDown
            data={selectItems}
            value={region}
            keyField={keyField}
            labelField={labelField ?? keyField}
            onSelect={(value: string) => setRegion(value)}
          />

          <SearchBar
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
            onKeyUp={(event) => {
              if (searchValue && event.code === 'Enter') goToProfilePage();
            }}
            placeholder={placeholder}
          />
          <Button onClick={goToProfilePage}>검색</Button>
        </div>
      </div>
    </div>
  );
}
