'use client';
import DropDown from '@/app/components/buttons/DropDown';
import SearchBar from '@/app/(game)/shared/components/search/SearchBar';
import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useNavigation } from '../../../hooks/useNavigation';
import { Dict } from '@/app/intrefaces/intreface';
import Link from 'next/link';
import { Search } from 'lucide-react';

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

  const gameTitles: Record<string, { title: string; subtitle: string }> = {
    lol: {
      title: 'League of Legends',
      subtitle: '소환사의 협곡에서 당신의 전적을 확인하세요',
    },
    tft: {
      title: 'Teamfight Tactics',
      subtitle: '전략적 팀 전투의 전적을 분석하세요',
    },
    pubg: {
      title: 'PUBG: BATTLEGROUNDS',
      subtitle: '배틀그라운드에서의 당신의 기록',
    },
  };

  const currentGame = gameTitles[currentTitle || ''] || { title: 'RS.GG', subtitle: '플레이어를 검색하여 전적을 확인하세요' };

  return (
    <div className="relative">
      {/* Background Image with Overlay */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <Image
          fill
          src={`/${currentTitle}_main.jpg`}
          alt={currentTitle || 'Game Banner'}
          priority
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-600/10" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-3 tracking-tight">
            {currentGame.title}
          </h1>
          <p className="text-white/80 text-base md:text-lg font-medium">{currentGame.subtitle}</p>
        </div>

        {/* Search Box */}
        <div className="w-full max-w-2xl animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
          <div className="flex flex-col sm:flex-row gap-3 bg-background/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/10">
            <DropDown
              data={selectItems}
              value={region}
              keyField={keyField}
              labelField={labelField ?? keyField}
              onSelect={(value: string) => setRegion(value)}
            />

            <div className="flex-1">
              <SearchBar
                value={searchValue}
                onChange={(value) => setSearchValue(value)}
                onKeyUp={(event) => {
                  if (searchValue && event.code === 'Enter') router.push(profilePageUrl);
                }}
                placeholder={placeholder || '플레이어 이름을 입력하세요'}
              />
            </div>

            <Link href={profilePageUrl}>
              <Button
                className="w-full sm:w-auto h-11 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                disabled={!searchValue}
              >
                <Search className="w-4 h-4 mr-2" />
                검색
              </Button>
            </Link>
          </div>

          {/* Quick Tips */}
          <div className="flex justify-center mt-4">
            <p className="text-white/60 text-sm">
              {currentTitle === 'lol' || currentTitle === 'tft'
                ? '닉네임#태그 형식으로 검색하세요 (예: Hide on bush#KR1)'
                : '플레이어 닉네임을 입력하세요'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
