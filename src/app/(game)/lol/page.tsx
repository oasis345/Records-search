import React from 'react';
import Image from 'next/image';
import TitleBanner from '../shared/components/TitleBanner';
import { regions } from '../shared/model/riot/regions';
import { LOLService } from '@/app/services/lol.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import gameServiceManager from '@/app/services/serviceManager';
import { BLUR_IMAGE_PATH } from '@/app/utils';
import Link from 'next/link';
import { Trophy, FileText, Users, RefreshCw } from 'lucide-react';

// ISR: 1시간마다 갱신
export const revalidate = 3600;

interface PatchNote {
  title: string;
  link: string;
}

interface RotationResponse {
  freeChampionIds: string[];
}

export default async function Page() {
  const service = await gameServiceManager.getService<LOLService>('lol');
  let response: RotationResponse = { freeChampionIds: [] };
  let patchNotes: PatchNote[] = [];

  try {
    const rotationData = await service.getRotationChampions();
    response = { freeChampionIds: rotationData?.freeChampionIds ?? [] };
  } catch (error) {
    console.error('Failed to fetch rotation champions:', error);
  }

  try {
    patchNotes = await service.patchNotes();
  } catch (error) {
    console.error('Failed to fetch patch notes:', error);
  }

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
          <Link href="/lol/leaderboard">
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

          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">로테이션</h3>
                <p className="text-sm text-muted-foreground">{response.freeChampionIds.length}개 챔피언 무료</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">전적 검색</h3>
                <p className="text-sm text-muted-foreground">상단에서 검색하세요</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patch Notes */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              최신 패치 노트
            </CardTitle>
          </CardHeader>
          <CardContent>
            {patchNotes.length > 0 ? (
              <ul className="space-y-2">
                {patchNotes.slice(0, 5).map((patchNode) => (
                  <li key={patchNode.title} className="flex items-center gap-3 hover:bg-muted/50 p-3 rounded-lg transition-colors group">
                    <span className="w-2 h-2 bg-primary rounded-full shrink-0"></span>
                    <Link
                      href={`https://www.leagueoflegends.com/${patchNode.link}`}
                      target="_blank"
                      className="text-foreground hover:text-primary transition-colors flex-1"
                    >
                      {patchNode.title}
                    </Link>
                    <svg
                      className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">패치 노트를 불러올 수 없습니다.</p>
            )}
          </CardContent>
        </Card>

        {/* Rotation Champions */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              로테이션 챔피언
              <span className="text-sm font-normal text-muted-foreground ml-2">
                이번 주 무료 챔피언
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {response.freeChampionIds.length > 0 ? (
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                {response.freeChampionIds.map((id: string) => {
                  const champion = service.champions.find((champion: any) => champion.key === String(id));
                  if (!champion) return null;

                  return (
                    <div key={id} className="flex flex-col items-center group">
                      <div className="relative overflow-hidden rounded-lg border-2 border-primary/20 group-hover:border-primary transition-colors">
                        <Image
                          className="w-12 h-12 md:w-16 md:h-16 object-cover"
                          width={64}
                          height={64}
                          src={service.getImageUrl('champion', champion.id)}
                          alt={champion.name}
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
              <p className="text-muted-foreground">로테이션 챔피언을 불러올 수 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
