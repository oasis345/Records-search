'use client';
import DropDown from '@/app/components/buttons/DropDown';
import SearchBar from '@/app/(game)/shared/components/search/SearchBar';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useNavigation } from '../../../hooks/useNavigation';
import { Dict } from '@/app/intrefaces/intreface';
import Link from 'next/link';

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
  const profilePageUrl = `/${currentTitle}/profile/${region}/${encodeURIComponent(searchValue)}`;

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
              if (searchValue && event.code === 'Enter') router.push(profilePageUrl);
            }}
            placeholder={placeholder}
          />
          <Link href={profilePageUrl}>
            <Button>검색</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
