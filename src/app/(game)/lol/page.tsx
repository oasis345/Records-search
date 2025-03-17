import React from 'react';
import Image from 'next/image';
import TitleBanner from '../shared/components/TitleBanner';
import { regions } from '../shared/model/riot/regions';
import { LOLService } from '@/app/services/lol.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import gameServiceManager from '@/app/services/serviceManager';
import { BLUR_IMAGE_PATH } from '@/app/utils';
import Link from 'next/link';

export default async function Page() {
  const service = await gameServiceManager.getService<LOLService>('lol');
  const response = await service.getRotationChampions();
  const patchNotes = await service.patchNotes();

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
            <CardTitle>최신 패치 노트</CardTitle>
          </CardHeader>
          <CardContent>
            {patchNotes.map((patchNode) => (
              <li key={patchNode.title} className="underline">
                <Link href={`https://www.leagueoflegends.com/${patchNode.link}`} target="_blank">
                  {patchNode.title}
                </Link>
              </li>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="container">
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
                      placeholder="blur"
                      blurDataURL={BLUR_IMAGE_PATH}
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
