import { regions } from './model/regions';
import React from 'react';
import TitleBanner from '../TitleBanner';
import { lolService } from '@/app/services/lol.service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default async function Page() {
  await lolService.init();
  const result: Record<string, any> = await lolService.getRotationChampions();

  return (
    <>
      <TitleBanner
        selectItems={regions}
        selectedItem={'kr'}
        keyField="name"
        labelField="label"
        placeholder="플레이어 이름 + #태그"
      />
      <div className="container py-5">
        <Card>
          <CardHeader>
            <CardTitle>로테이션 챔피언</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-8 gap-1">
              {result.freeChampionIds.map((id: string) => {
                const champion = lolService.champions.find((champion: any) => champion.key === String(id));

                return (
                  <div key={id}>
                    <Image
                      width={65}
                      height={65}
                      src={lolService.getImageUrl('champion', champion.id)}
                      alt="Rotation Champion"
                    />
                    <p className="text-sm font-semibold">{champion.name}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
