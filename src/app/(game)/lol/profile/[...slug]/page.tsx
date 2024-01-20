'use client';

import { lolService } from '@/app/services/lol.service';
import { ProxyApiService } from '@/app/services/proxy.api.service';
import { RiotService } from '@/app/services/riot.service';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect } from 'react';
import { AccountInfo, Match, Participant } from '../../model/interface';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { gameMode } from '../../model/gameMode';
import dayjs from '@/app/utils/dayjs';
import { secondsToMinutesAndSeconds } from '@/app/utils/utils';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/app/components/card/ProfileCard';
import { useRecoilState } from 'recoil';
import { searchHistoryState } from '@/app/store/searchHistoryState';

export default function Page({ params }: { params: any }) {
  const [accountInfo, setAccountInfo] = React.useState<AccountInfo>({} as AccountInfo);
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
      const result = await service.getAccount<AccountInfo>({ region, name });
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
      <div className="w-40 grid gap-1">
        {participants.map((participant) => {
          return (
            <div key={participant.puuid} className="flex">
              <Image
                width={18}
                height={18}
                style={{ height: '18px' }}
                src={getImgUrl('champion', participant.championName)}
                alt="Image"
              />
              <p className="text-xs">{participant.riotIdGameName}</p>
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
      <div>
        <p>{`${kills} / ${deaths} / ${assists}`}</p>
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
      <div className="flex flex-col w-32 items-center">
        <p>{isWin ? '승리' : '패배'}</p>
        <p>{gameModeLabel ?? match.info.gameMode}</p>
        <p>{formattedGameCreationDate}</p>
        <p>{`${durationMinutes}분 ${durationSeconds}초`}</p>
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
                  <div className="flex h-32 my-3 items-center">
                    <MatchDetails match={match} />

                    <div className="w-full flex justify-around">
                      <Image
                        width={64}
                        height={64}
                        src={getImgUrl('champion', findMyMatchData(match).championName)}
                        alt="Image"
                      />
                      <Stats match={match} />
                      <div id="items" className="grid grid-cols-4 gap-1">
                        <Items match={match} />
                      </div>
                    </div>

                    <div id="participants" className="flex w-80">
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
