'use client';

import { lolService } from '@/app/services/lol.service';
import { ProxyApiService } from '@/app/services/proxy.api.service';
import { RiotService } from '@/app/services/riot.service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect } from 'react';
import { SummonerInfo, Match, Participant } from '../../models/interface';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { gameMode } from '../../models/gameMode';
import dayjs from '@/app/utils/dayjs';
import { secondsToMinutesAndSeconds } from '@/app/utils';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/app/components/card/ProfileCard';
import { useRecoilState } from 'recoil';
import { searchHistoryState } from '@/app/store/searchHistoryState';

export default function Page({ params }: { params: any }) {
  const [accountInfo, setAccountInfo] = React.useState<SummonerInfo>({} as SummonerInfo);
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [dragonApiVersion, setDragonApiVersion] = React.useState('');
  const service = new ProxyApiService(lolService);
  const riotService = new RiotService();
  const [isNotFound, setIsNotFound] = React.useState(false);
  const [histories, setHistories] = useRecoilState(searchHistoryState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [region, name] = decodeURI(params.slug).split(',');
      const result = await service.getAccount<SummonerInfo>({ region, name });
      const latestDragonApiVersion = await riotService.getLatestDragonApiVersion();

      if (!histories.find((item) => item.name === result.name))
        setHistories([...histories, { name: result.name, region }]);

      setDragonApiVersion(latestDragonApiVersion);
      setAccountInfo(result);
      fetchMatchData(result.puuid);
    } catch (error) {
      setIsNotFound(true);
    }
  };

  const fetchMatchData = async (id: string, start: number = 0) => {
    const matchData: Match[] = await service.getMatches(id, start);

    if (matches.length === 0) {
      setMatches(matchData);
    } else if (matchData.length > 0) {
      setMatches([...matches, ...matchData]);
    }
  };

  const getImgUrl = (category: 'profileIcon' | 'champion' | 'item', name: string | Number) => {
    const DRAGON_IMG_URL = `https://ddragon.leagueoflegends.com/cdn/${dragonApiVersion}/img`;
    const categoryMap = {
      profileIcon: 'profileicon',
      champion: 'champion',
      item: 'item',
    };
    const categoryPath = categoryMap[category];
    const imgUrl = `${DRAGON_IMG_URL}/${categoryPath}/${name}.png`;

    return imgUrl;
  };

  const findMyMatchData = (match: Match) => {
    return match.info.participants.find((participant) => participant.puuid === accountInfo?.puuid)!;
  };

  const TeamParticipants: React.FC<{ participants: Participant[] }> = ({ participants }) => {
    return (
      <div className="grid w-40 gap-1">
        {participants.map((participant) => {
          return (
            <div key={participant.puuid} className="flex w-28">
              <Image
                width={18}
                height={18}
                style={{ height: '18px' }}
                src={getImgUrl('champion', participant.championName)}
                alt="Image"
              />
              <p className="text-xs text-ellipsis overflow-hidden text-nowrap">{participant.riotIdGameName}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const Items: React.FC<{ match: Match }> = ({ match }) => {
    const MAX_ITEM_LENGTH = 6;
    const itemArray = [];

    for (let index = 0; index <= MAX_ITEM_LENGTH; index++) {
      const itemKey = `item${index}`;
      // @ts-ignore
      const item: number = findMyMatchData(match)[itemKey];

      if (item !== 0)
        itemArray.push(
          <Image
            key={itemKey}
            width={32}
            height={32}
            style={{ height: '32px' }}
            src={getImgUrl('item', item)}
            alt="Image"
          />
        );
    }

    return itemArray;
  };

  const Stats: React.FC<{ match: Match }> = ({ match }) => {
    const { kills, assists, deaths } = findMyMatchData(match);

    return (
      <div className="flex flex-col items-center">
        <div className="flex font-bold">
          <p>{kills}</p>&nbsp;/&nbsp;<p className="text-red-500">{deaths}</p>&nbsp;/&nbsp;<p>{assists}</p>
        </div>
        <p className="text-sm">{((kills + assists) / deaths).toFixed(2)} 평점</p>
      </div>
    );
  };

  const MatchDetails: React.FC<{ match: Match }> = ({ match }) => {
    const isWin = findMyMatchData(match).win;
    const gameModeLabel = gameMode.find((mode) => mode.key === match.info.gameMode)?.label;
    const formattedGameCreationDate = dayjs(match.info.gameCreation).format('MM월 DD일');
    const durationMinutes = secondsToMinutesAndSeconds(match.info.gameDuration).minutes;
    const durationSeconds = secondsToMinutesAndSeconds(match.info.gameDuration).remainingSeconds;

    return (
      <div className="flex md:flex-col lg:flex-col md:w-32 lg:w-32 w-full items-center">
        <p className={`mx-1 font-bold ${isWin ? 'text-blue-500' : 'text-red-500'}`}>{isWin ? '승리' : '패배'}</p>
        <p className="mx-1 text-sm">{gameModeLabel ?? match.info.gameMode}</p>
        <p className="mx-1 text-xs">{`${durationMinutes}분 ${durationSeconds}초`}</p>
        <p className="mx-1 text-xs">{formattedGameCreationDate}</p>
      </div>
    );
  };

  return isNotFound ? (
    <div>존재하지 않는 유저입니다</div>
  ) : (
    accountInfo && (
      <div>
        {accountInfo.profileIconId && (
          <ProfileCard imageSrc={getImgUrl('profileIcon', accountInfo.profileIconId)} name={accountInfo.name} />
        )}
        <Card>
          <CardHeader>
            <CardTitle>매치 이력</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {matches.map((match) => (
                <AccordionItem key={match.metadata.matchId} value={match.metadata.matchId}>
                  <div className="flex-col md:flex-row lg:flex-row flex my-2 items-center">
                    <MatchDetails match={match} />

                    <div className="w-full flex justify-around">
                      <Image
                        width={52}
                        height={52}
                        layout="fixed"
                        src={getImgUrl('champion', findMyMatchData(match).championName)}
                        alt="Image"
                      />
                      <Stats match={match} />
                      <div id="items" className="grid grid-cols-4 gap-1">
                        <Items match={match} />
                      </div>
                    </div>

                    <div id="participants" className="hidden w-80 md:flex lg:flex">
                      <TeamParticipants
                        participants={match.info.participants.filter(
                          (participant: Participant) => participant.teamId === 100
                        )}
                      />

                      <TeamParticipants
                        participants={match.info.participants.filter(
                          (participant: Participant) => participant.teamId === 200
                        )}
                      />
                    </div>
                    <AccordionTrigger />
                  </div>

                  <AccordionContent>미구현</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        <Button className="w-full" onClick={() => fetchMatchData(accountInfo.puuid, matches.length)}>
          더 보기
        </Button>
      </div>
    )
  );
}
