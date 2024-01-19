'use client';

import { lolService } from '@/app/services/lol.service';
import { ProxyApiService } from '@/app/services/proxy.api.service';
import { RiotService } from '@/app/services/riot.service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useCallback, useEffect, useState } from 'react';
import { AccountInfo, MatchDto } from '../../model/interface';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { gameMode } from '../../model/gameMode';
import dayjs from '@/app/utils/dayjs';
import { secondsToMinutesAndSeconds } from '@/app/utils/utils';

export default function Page({ params }: { params: any }) {
  const [isNotFound, setIsNotFound] = React.useState(false);
  const [accountInfo, setAccountInfo] = React.useState<AccountInfo>();
  const [iconUrl, setIconUrl] = React.useState('');
  const [matches, setMatches] = React.useState<MatchDto[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    const [region, name] = decodeURI(params.slug).split(',');
    const service = new ProxyApiService(lolService);
    const riotService = new RiotService();

    try {
      const result = await service.getAccount<AccountInfo>({ region, name });
      setAccountInfo(result);

      const version = await riotService.getLatestDragonApiVersion();
      setIconUrl(`https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${result.profileIconId}.png`);

      const matches: MatchDto = await service.getMatches(result.puuid);
      console.log(matches);
      setMatches(matches);
    } catch (error) {
      setIsNotFound(true);
    }
  }, [params]);
  return isNotFound ? (
    `검색결과를 찾을 수 없습니다`
  ) : (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex">
              <Image width={120} height={120} src={iconUrl} alt="Image" />
              {accountInfo?.name}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>매치 히스토리</CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {matches.map((match) => (
              <AccordionItem key={match.metadata.matchId} value={match.metadata.matchId}>
                <div className="flex justify-between">
                  {gameMode.find((mode) => mode.key === match.info.gameMode)?.label ?? match.info.gameMode}
                  {dayjs(match.info.gameCreation).format('M월 DD일')}
                  {`${secondsToMinutesAndSeconds(match.info.gameDuration).minutes}:${
                    secondsToMinutesAndSeconds(match.info.gameDuration).remainingSeconds
                  }`}
                  <AccordionTrigger></AccordionTrigger>
                </div>

                <AccordionContent>456</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
