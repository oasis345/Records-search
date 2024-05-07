import React from 'react';
import Image from 'next/image';
import TitleBanner from '../shared/components/TitleBanner';
import { regions } from '../shared/model/riot/regions';
import { LOLService } from '@/app/services/lol.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import gameServiceManager from '@/app/services/serviceManager';
import { httpService } from '@/app/services/httpService';

export default async function Page() {
  const service = await gameServiceManager.getService<LOLService>('lol');
  const response = await service.getRotationChampions(httpService.getRevalidateMap('weekend'));

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
              {response.freeChampionIds.map((id: string) => {
                const champion = service.champions.find((champion: any) => champion.key === String(id));

                return (
                  <div key={id}>
                    <Image
                      className="w-[35px] md:w-[65px] h-auto border-blue-300 border"
                      width={65}
                      height={65}
                      src={service.getImageUrl('champion', champion.id)}
                      alt="Rotation Champion"
                    />
                    <p className="text-sm md:font-thin">{champion.name}</p>
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
