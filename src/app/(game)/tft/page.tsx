import { regions } from '../shared/model/riot/regions';
import React from 'react';
import TitleBanner from '../shared/components/TitleBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import gameServiceManager from '@/app/services/serviceManager';
import { TFTService } from '@/app/services/tft.service';
import { BLUR_IMAGE_PATH } from '@/app/utils';
import Link from 'next/link';
import { Trophy, Sparkles, Users } from 'lucide-react';

// ISR: 1시간마다 갱신
export const revalidate = 3600;

export default async function Page() {
  const service = await gameServiceManager.getService<TFTService>('tft');

  // 현재 시즌 챔피언들 (최대 20개)
  const champions = Array.isArray(service.champions) ? service.champions.slice(0, 20) : [];

  // 인기 증강체 (최대 12개)
  const augments = Array.isArray(service.augments) ? service.augments.slice(0, 12) : [];

  return (
    <>
      <TitleBanner
        selectItems={regions}
        selectedItem={'kr'}
        keyField="name"
        labelField="label"
        placeholder="플레이어 이름 + #태그"
      />
      <div className="container py-6 space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/tft/leaderboard">
            <Card className="border-none shadow-lg bg-gradient-to-br from-yellow-500/10 to-orange-500/10 hover:from-yellow-500/20 hover:to-orange-500/20 transition-all duration-300 cursor-pointer group">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">랭킹</h3>
                  <p className="text-sm text-muted-foreground">챌린저 랭킹 확인하기</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">시즌 정보</h3>
                <p className="text-sm text-muted-foreground">Set 14 진행 중</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">전적 검색</h3>
                <p className="text-sm text-muted-foreground">상단에서 검색하세요</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Champions Section */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              TFT 챔피언
            </CardTitle>
          </CardHeader>
          <CardContent>
            {champions.length > 0 ? (
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                {champions.map((champion: any) => {
                  if (!champion?.id) return null;

                  return (
                    <div key={champion.id} className="flex flex-col items-center group">
                      <div className="relative overflow-hidden rounded-lg border-2 border-primary/20 group-hover:border-primary transition-colors">
                        <Image
                          className="w-12 h-12 md:w-14 md:h-14 object-cover"
                          width={56}
                          height={56}
                          src={service.getImageUrl('champion', champion.image?.full || `${champion.id}.png`)}
                          alt={champion.name || 'Champion'}
                          placeholder="blur"
                          blurDataURL={BLUR_IMAGE_PATH}
                        />
                      </div>
                      <p className="text-xs mt-1 text-center text-muted-foreground group-hover:text-foreground transition-colors truncate w-full">
                        {champion.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">챔피언 정보를 불러올 수 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* Augments Section */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              증강체
            </CardTitle>
          </CardHeader>
          <CardContent>
            {augments.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
                {augments.map((augment: any) => {
                  if (!augment?.id) return null;

                  return (
                    <div key={augment.id} className="flex flex-col items-center group">
                      <div className="relative overflow-hidden rounded-lg border-2 border-purple-500/20 group-hover:border-purple-500 transition-colors bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-1">
                        <Image
                          className="w-10 h-10 md:w-12 md:h-12 object-cover"
                          width={48}
                          height={48}
                          src={service.getImageUrl('augment', augment.image?.full || `${augment.id}.png`)}
                          alt={augment.name || 'Augment'}
                          placeholder="blur"
                          blurDataURL={BLUR_IMAGE_PATH}
                        />
                      </div>
                      <p className="text-[10px] mt-1 text-center text-muted-foreground group-hover:text-foreground transition-colors truncate w-full">
                        {augment.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">증강체 정보를 불러올 수 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              TFT 팁
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></span>
                <span>초반에는 경제를 관리하며 이자를 쌓는 것이 중요합니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></span>
                <span>시너지 효과를 최대한 활용하여 팀 구성을 최적화하세요.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0"></span>
                <span>아이템 조합을 미리 계획하고 카루셀에서 필요한 아이템을 선택하세요.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
