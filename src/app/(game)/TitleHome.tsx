'use client';
import DropDown from '@/app/components/buttons/DropDown';
import SearchBar from '@/app/(game)/components/SearchBar';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dict } from '../types/interface';
import { useNavigation } from '../hooks/useNavigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function TitleHome({
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

  const goProfile = async () => {
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
              if (searchValue && event.code === 'Enter') goProfile();
            }}
            placeholder={placeholder}
          />
          <Button onClick={goProfile}>검색</Button>
        </div>
      </div>
      {/* <div className="container flex">
        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>패치 노트</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>

        <Card className="w-1/2">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
