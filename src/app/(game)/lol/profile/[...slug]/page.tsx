'use client';

import React, { useEffect, useMemo, useCallback } from 'react';
import { Summoner, Match, Participant, TeamStats } from '../../model/interface';
import Image from 'next/image';
import { gameModes } from '../../model/gameModes';
import dayjs from '@/app/utils/dayjs';
import { secondsToMinutes } from '@/app/utils';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/app/components/card/ProfileCard';
import { useRecoilState } from 'recoil';
import { searchHistoryState } from '@/app/store/searchHistoryState';
import { AccordionCard } from '@/app/components/card/AccordionCard';
import { httpService } from '@/app/services/httpService';
import { riotService } from '@/app/services/riot.service';
import { regions } from '../../../model/regions';
import { SearchItem } from '@/app/types/interface';
import { Card, CardHeader } from '@/components/ui/card';
import { useNavigation } from '@/app/hooks/useNavigation';
import { BLUR_IMAGE_PATH } from '@/app/utils';

export default function Page({ params }: { params: any }) {
  const [summoner, setSummoner] = React.useState<Summoner>({} as Summoner);
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [isNotFound, setIsNotFound] = React.useState(false);
  const [accordionItems, setAccordionItems] = React.useState<AccordionCardItemProps[]>([]);
  const { router, currentTitle } = useNavigation();
  const [histories, setHistories] = useRecoilState<SearchItem[]>(searchHistoryState);
  const [region, searchText] = useMemo(() => decodeURIComponent(params.slug).split(','), [params.slug]);
  const continent = useMemo(() => regions.find((item) => item.name === region)?.parent ?? 'asia', [region]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await riotService.init();
    const summoner = await fetchSummoner();

    if (summoner?.puuid) {
      setSummoner(summoner);

      if (!histories.find((item) => item.name === summoner?.name))
        setHistories([...histories, { title: currentTitle, name: summoner.name, region }]);

      loadMatch(summoner);
    }
  };

  const fetchSummoner = async () => {
    try {
      const result = await httpService.get<Summoner>({
        url: '/api/lol/summoner',
        params: { region, name: searchText },
      });

      return result;
    } catch (error) {
      setIsNotFound(true);
    }
  };

  const fetchMatch = async (puuid: string, start: number = 0) => {
    const result: Match[] = await httpService.get({
      url: '/api/lol/matches',
      params: { region: continent, puuid, start },
    });

    return result;
  };

  const loadMatch = async (summoner: Summoner) => {
    const matchData = await fetchMatch(summoner.puuid, matches.length);
    setMatches([...matches, ...matchData]);
    setAccordionItems([...accordionItems, ...createAccordionItems(matchData, summoner)]);
  };

  const TeamParticipants: React.FC<{ participants: Participant[] }> = ({ participants }) => {
    return (
      <div className="hidden lg:grid md:grid grid w-40 gap-1">
        {participants.map((participant) => {
          return (
            <div
              key={participant.puuid}
              className="flex w-28 cursor-pointer"
              onClick={() => window.open(`/lol/profile/${region}/${participant.summonerName}`)}
            >
              <Image
                width={18}
                height={18}
                style={{ height: '18px' }}
                src={riotService.getImageUrl('champion', participant.championName)}
                alt="Participant Image"
                placeholder="blur"
                blurDataURL={BLUR_IMAGE_PATH}
              />
              <p className="text-xs text-ellipsis overflow-hidden text-nowrap">{participant.riotIdGameName}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const MatchResult: React.FC<{ match: Match; participant: Participant }> = ({ match, participant }) => {
    const { info } = match;
    const { win } = participant;
    const gameModeLabel = gameModes.find((mode) => mode.key === info.gameMode)?.label;
    const formattedGameCreationDate = dayjs(info.gameCreation).format('MM월 DD일');
    const { minutes: durationMinutes, remainingSeconds: durationSeconds } = secondsToMinutes(info.gameDuration);

    return (
      <div className="flex md:flex-col lg:flex-col md:w-32 lg:w-32 w-full items-center">
        <p className={`mx-1 font-bold ${win ? 'text-blue-500' : 'text-red-500'}`}>{win ? '승리' : '패배'}</p>
        <p className="mx-1 text-sm">{gameModeLabel ?? info.gameMode}</p>
        <p className="mx-1 text-xs">{`${durationMinutes}분 ${durationSeconds}초`}</p>
        <p className="mx-1 text-xs">{formattedGameCreationDate}</p>
      </div>
    );
  };

  const Items: React.FC<{ participant: Participant; size: number }> = ({ participant, size }) => {
    const MAX_ITEM_LENGTH = 6;
    const items = [];

    for (let index = 0; index <= MAX_ITEM_LENGTH; index++) {
      const itemKey = `item${index}`;
      // @ts-ignore
      const itemNumber: number = participant[itemKey];

      if (itemNumber !== 0) {
        items.push(
          <Image
            key={itemKey}
            width={size}
            height={size}
            style={{ height: `${size}px` }}
            src={riotService.getImageUrl('item', itemNumber)}
            alt="Item Image"
            placeholder="blur"
            blurDataURL={BLUR_IMAGE_PATH}
          />,
        );
      }
    }

    return items;
  };

  const MainContent: React.FC<{ match: Match; participant: Participant; isDetail?: boolean }> = ({
    match,
    participant,
    isDetail,
  }) => {
    const { kills, assists, deaths, riotIdGameName, riotIdTagline, totalDamageTaken, totalMinionsKilled } = participant;
    const rating = ((kills + assists) / deaths).toFixed(2);
    const csPerMinute = (totalMinionsKilled / secondsToMinutes(match.info.gameDuration).minutes).toFixed(1);

    return (
      <div className="flex w-full p-2 items-center justify-between">
        <div className="flex text-xs text-nowrap items-center grow shrink-0">
          <div className="flex">
            <Image
              width={isDetail ? 34 : 48}
              height={isDetail ? 34 : 48}
              src={riotService.getImageUrl('champion', participant.championName)}
              alt="Champion Image"
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_PATH}
            />
            <div className="grid grid-cols-1 gap-1 px-1">
              <Image
                width={isDetail ? 15 : 22}
                height={isDetail ? 15 : 22}
                src={riotService.getImageUrl('spell', participant.summoner1Id)}
                alt="spell_1"
                placeholder="blur"
                blurDataURL={BLUR_IMAGE_PATH}
              />
              <Image
                width={isDetail ? 15 : 22}
                height={isDetail ? 15 : 22}
                src={riotService.getImageUrl('spell', participant.summoner2Id)}
                alt="spell_2"
                placeholder="blur"
                blurDataURL={BLUR_IMAGE_PATH}
              />
            </div>
          </div>
          <div className="items-center text-ellipsis overflow-hidden grow">
            {isDetail && <p>{`${riotIdGameName}`}</p>}
            <div className="flex font-bold text-xs items-center" style={{ flexDirection: isDetail ? 'row' : 'column' }}>
              <span className="flex">
                <p>{kills}</p> / <p className="text-red-500">{deaths}</p> / <p>{assists}</p>
              </span>

              <p className="text-gray-400">&nbsp;{rating}평점</p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex md:flex flex-col items-center text-nowrap px-2 grow">
          <p className="text-xs"> {`cs ${totalMinionsKilled} (${csPerMinute}/m)`} </p>
          <p className="text-xs"> {`${totalDamageTaken} 피해량`} </p>
        </div>
        <div id="items" className="grid grid-cols-4 gap-1 px-2">
          <Items participant={participant} size={isDetail ? 22 : 28} />
        </div>
      </div>
    );
  };

  const Detail: React.FC<{
    teamStats: { totalKills: number; totalAssists: number; totalDeaths: number };
    participants: Participant[];
    match: Match;
  }> = ({ teamStats, participants, match }) => {
    const { totalKills, totalAssists, totalDeaths } = teamStats;

    return (
      <div className="w-full h-full p-x border">
        <div className="flex font-bold p-2">
          <p>팀 스코어</p> &nbsp;
          <p>{totalKills}</p> / <p className="text-red-500">{totalDeaths}</p> / <p>{totalAssists}</p>
        </div>
        <div className="border h-full">
          {participants.map((participant) => (
            <div key={participant.puuid} className="flex justify-between items-center border-b h-14">
              <MainContent participant={participant} isDetail={true} match={match} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const createAccordionItems = (matches: Match[], summoner: Summoner) => {
    return matches.map((match) => {
      const {
        metadata: { matchId },
        info: { participants, ...info },
      } = match;
      const myInfo = match.info.participants.find((participant) => participant.puuid === summoner?.puuid)!;
      const defaultModeTeamIds = [100, 200];
      const getSeparatedTeams = (
        participants: Participant[],
        teamIds: number[],
        filterFunc: (participant: Participant, id: number) => boolean,
      ) => {
        return teamIds.map((id) => {
          const teams = participants.filter((participant) => filterFunc(participant, id));
          return {
            participants: teams,
            stats: teams.reduce<TeamStats>(
              (totals, participant) => {
                totals.totalKills += participant.kills;
                totals.totalAssists += participant.assists;
                totals.totalDeaths += participant.deaths;
                return totals;
              },
              { totalKills: 0, totalAssists: 0, totalDeaths: 0 },
            ),
          };
        });
      };

      const defaultModeTeams = getSeparatedTeams(
        participants,
        defaultModeTeamIds,
        (participant, id) => participant.teamId === id,
      );

      const getDetailContentByMode = (mode: string) => {
        switch (mode) {
          case 'CHERRY':
            const cherryModeTeamIds = [1, 2, 3, 4];

            return getSeparatedTeams(
              participants,
              cherryModeTeamIds,
              (participant, id) => participant.playerSubteamId === id,
            ).map((team: any, index: number) => (
              <Detail key={index} match={match} participants={team.participants} teamStats={team.stats} />
            ));
          default:
            return (
              <div className="flex flex-col md:flex-row lg:flex-row">
                {defaultModeTeams.map((team: any, index: number) => (
                  <Detail key={index} match={match} participants={team.participants} teamStats={team.stats} />
                ))}
              </div>
            );
        }
      };

      return {
        key: matchId,
        item: match,
        header: <MatchResult match={match} participant={myInfo} />,
        content: <MainContent participant={myInfo} match={match} />,
        subContent: defaultModeTeams.map((team: any, index: number) => (
          <TeamParticipants key={index} participants={team.participants} />
        )),
        detail: getDetailContentByMode(info.gameMode),
      };
    });
  };

  return isNotFound ? (
    <Card className="container flex justify-center">
      <CardHeader>
        <p>{`'${region.toUpperCase()}'지역 내 '${searchText}'검색 결과가 업습니다.`}</p>
        <Button className="w-full" onClick={() => router.push('/lol')}>
          돌아가기
        </Button>
      </CardHeader>
    </Card>
  ) : (
    summoner.puuid && (
      <div className="container">
        <ProfileCard imageSrc={riotService.getImageUrl('profileIcon', summoner.profileIconId)} name={summoner.name} />
        <AccordionCard title="매치 이력" type="multiple" items={accordionItems}></AccordionCard>
        <Button className="w-full" onClick={() => loadMatch(summoner)}>
          더 보기
        </Button>
      </div>
    )
  );
}
