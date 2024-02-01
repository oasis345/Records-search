'use client';

import React, { useEffect } from 'react';
import { SummonerInfo, Match, Participant, TeamStats } from '../../models/interface';
import Image from 'next/image';
import { gameModes } from '../../models/gameModes';
import dayjs from '@/app/utils/dayjs';
import { secondsToMinutes } from '@/app/utils';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/app/components/card/ProfileCard';
import { useRecoilState } from 'recoil';
import { searchHistoryState } from '@/app/store/searchHistoryState';
import { AccordionCard } from '@/app/components/card/AccordionCard';
import { httpService } from '@/app/services/rest.data.service';
import { riotService } from '@/app/services/riot.service';
import { regions } from '../../models/regions';
import { SearchItem } from '@/app/types/interface';

export default function Page({ params }: { params: any }) {
  const [summonerInfo, setSummonerInfo] = React.useState<SummonerInfo>({} as SummonerInfo);
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [isNotFound, setIsNotFound] = React.useState(false);
  const [histories, setHistories] = useRecoilState<SearchItem[]>(searchHistoryState);
  const [region, searchText] = decodeURIComponent(params.slug).split(',');
  const { parent } = regions.find((item) => item.name === region)!;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await riotService.init();
      const summoner = await httpService.get({ url: '/api/lol/getSummoner', params: { region, name: searchText } });

      if (!histories.find((item) => item.name === summonerInfo.name))
        setHistories([...histories, { name: summoner.name, region }]);

      setSummonerInfo(summoner);
      fetchMatchData(summoner.puuid);
    } catch (error) {
      setIsNotFound(true);
    }
  };

  const fetchMatchData = async (puuid: string, start: number = 0) => {
    const matchData: Match[] = await httpService.get({
      url: '/api/lol/getMatches',
      params: { region: parent, puuid, start },
    });

    if (matches.length === 0) {
      setMatches(matchData);
    } else if (matchData.length > 0) {
      setMatches([...matches, ...matchData]);
    }
  };

  const findMyMatchData = (match: Match): Participant => {
    return match.info.participants.find((participant) => participant.puuid === summonerInfo?.puuid)!;
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
                alt="Image"
              />
              <p className="text-xs text-ellipsis overflow-hidden text-nowrap">{participant.riotIdGameName}</p>
            </div>
          );
        })}
      </div>
    );
  };

  const MatchResult: React.FC<{ match: Match; participant: Participant }> = ({ match, participant }) => {
    const { win } = participant;
    const gameModeLabel = gameModes.find((mode) => mode.key === match.info.gameMode)?.label;
    const formattedGameCreationDate = dayjs(match.info.gameCreation).format('MM월 DD일');
    const { minutes: durationMinutes, remainingSeconds: durationSeconds } = secondsToMinutes(match.info.gameDuration);

    return (
      <div className="flex md:flex-col lg:flex-col md:w-32 lg:w-32 w-full items-center">
        <p className={`mx-1 font-bold ${win ? 'text-blue-500' : 'text-red-500'}`}>{win ? '승리' : '패배'}</p>
        <p className="mx-1 text-sm">{gameModeLabel ?? match.info.gameMode}</p>
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
            alt="Image"
          />
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
      <div className="flex w-full p-2 items-center">
        <div className="flex text-xs text-nowrap items-center w-1/2">
          <Image
            width={isDetail ? 34 : 48}
            height={isDetail ? 34 : 48}
            src={riotService.getImageUrl('champion', participant.championName)}
            alt="Champion Image"
          />
          <div className="items-center text-ellipsis overflow-hidden px-2 ">
            {isDetail && <p>{`${riotIdGameName}`}</p>}
            <div className="flex font-bold text-xs items-center" style={{ flexDirection: isDetail ? 'row' : 'column' }}>
              <span className="flex">
                <p>{kills}</p> / <p className="text-red-500">{deaths}</p> / <p>{assists}</p>
              </span>

              <p className="text-gray-400">&nbsp;{rating}평점</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center text-nowrap px-2 w-1/4">
          <p className="text-xs"> {`cs ${totalMinionsKilled} (${csPerMinute}/m)`} </p>
          <p className="text-xs"> {`${totalDamageTaken} 피해량`} </p>
        </div>
        <div id="items" className="grid grid-cols-4 gap-1 px-2">
          <Items participant={participant} size={isDetail ? 20 : 24} />
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

  const calculateTeamStats = (participants: Participant[]): TeamStats => {
    return participants.reduce<TeamStats>(
      (totals, participant) => {
        totals.totalKills += participant.kills;
        totals.totalAssists += participant.assists;
        totals.totalDeaths += participant.deaths;
        return totals;
      },
      { totalKills: 0, totalAssists: 0, totalDeaths: 0 }
    );
  };

  const getTeamParticipants = (
    participants: Participant[],
    filterFunc: (participant: Participant) => boolean
  ): Participant[] => {
    return participants.filter(filterFunc);
  };

  const getSeparatedTeams = (
    participants: Participant[],
    teamIds: number[],
    filterFunc: (participant: Participant, id: number) => boolean
  ) => {
    return teamIds.map((id) => {
      const teams = getTeamParticipants(participants, (participant) => filterFunc(participant, id));
      return {
        participants: teams,
        stats: calculateTeamStats(teams),
      };
    });
  };

  const accordionItems = matches.map((match) => {
    const { metadata, info } = match;
    const { participants } = info;
    const { matchId } = metadata;

    const header = <MatchResult match={match} participant={findMyMatchData(match)} />;
    const content = <MainContent participant={findMyMatchData(match)} match={match} />;

    const getDetailContentByMode = (mode: string, defaultModeTeams: any[], cherryModeTeams: any[]) => {
      switch (mode) {
        case 'CHERRY':
          return cherryModeTeams.map((team: any, index: number) => (
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

    const defaultModeTeamIds = [100, 200];
    const cherryModeTeamIds = [1, 2, 3, 4];

    const defaultModeTeams = getSeparatedTeams(
      participants,
      defaultModeTeamIds,
      (participant, id) => participant.teamId === id
    );
    const cherryModeTeams = getSeparatedTeams(
      participants,
      cherryModeTeamIds,
      (participant, id) => participant.playerSubteamId === id
    );

    const subContent = defaultModeTeams.map((team: any, index: number) => (
      <TeamParticipants key={index} participants={team.participants} />
    ));

    const detail = getDetailContentByMode(info.gameMode, defaultModeTeams, cherryModeTeams);

    return {
      key: matchId,
      item: match,
      header,
      content,
      subContent,
      detail,
    };
  });

  return isNotFound ? (
    <div>존재하지 않는 유저입니다</div>
  ) : (
    summonerInfo.puuid && (
      <div>
        <ProfileCard
          imageSrc={riotService.getImageUrl('profileIcon', summonerInfo.profileIconId)}
          name={summonerInfo.name}
        />
        <AccordionCard title="매치 이력" type="multiple" items={accordionItems}></AccordionCard>
        <Button className="w-full" onClick={() => fetchMatchData(summonerInfo.puuid, matches.length)}>
          더 보기
        </Button>
      </div>
    )
  );
}
