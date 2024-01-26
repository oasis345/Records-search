'use client';

import { lolService } from '@/app/services/lol.service';
import { ProxyApiService } from '@/app/services/proxy.api.service';
import { riotService } from '@/app/services/riot.service';
import React, { useEffect } from 'react';
import { SummonerInfo, Match, Participant, TeamStats } from '../../models/interface';
import Image from 'next/image';
import { gameMode } from '../../models/gameMode';
import dayjs from '@/app/utils/dayjs';
import { secondsToMinutes } from '@/app/utils';
import { Button } from '@/components/ui/button';
import ProfileCard from '@/app/components/card/ProfileCard';
import { useRecoilState } from 'recoil';
import { searchHistoryState } from '@/app/store/searchHistoryState';
import { AccordionCard } from '@/app/components/card/AccordionCard';

export default function Page({ params }: { params: any }) {
  const [accountInfo, setAccountInfo] = React.useState<SummonerInfo>({} as SummonerInfo);
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [isNotFound, setIsNotFound] = React.useState(false);
  const [histories, setHistories] = useRecoilState(searchHistoryState);
  const service = new ProxyApiService(lolService);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [region, name] = decodeURI(params.slug).split(',');
      const result = await service.getAccount<SummonerInfo>({ region, name });
      await riotService.init();
      if (!histories.find((item) => item.name === result.name))
        setHistories([...histories, { name: result.name, region }]);

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
    }
    // else if (matchData.length > 0) {
    //   setMatches([...matches, ...matchData]);
    // }
  };

  const findMyMatchData = (match: Match): Participant => {
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
    const gameModeLabel = gameMode.find((mode) => mode.key === match.info.gameMode)?.label;
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
        <div className="flex text-xs text-ellipsis text-nowrap items-center w-1/4">
          <Image
            width={isDetail ? 34 : 52}
            height={isDetail ? 34 : 52}
            src={riotService.getImageUrl('champion', participant.championName)}
            alt="Champion Image"
          />
          {isDetail && <p>{`${riotIdGameName}#${riotIdTagline}`}</p>}
        </div>
        <div className="flex flex-col items-center w-1/4">
          <div className="flex font-bold">
            <p>{kills}</p> / <p className="text-red-500">{deaths}</p> / <p>{assists}</p>
          </div>
          <p className="text-sm">{rating} 평점</p>
        </div>
        <div className="flex flex-col items-center w-1/4">
          <p className="text-xs"> {`cs ${totalMinionsKilled} (${csPerMinute}/m)`} </p>
          <p className="text-xs"> {`${totalDamageTaken} 피해량`} </p>
        </div>
        <div id="items" className="grid grid-cols-4 gap-1">
          <Items participant={participant} size={24} />
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

  // playerSubteamId 아레나 팀

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
          return defaultModeTeams.map((team: any, index: number) => (
            <Detail key={index} match={match} participants={team.participants} teamStats={team.stats} />
          ));
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
    accountInfo.profileIconId && (
      <div>
        <ProfileCard
          imageSrc={riotService.getImageUrl('profileIcon', accountInfo.profileIconId)}
          name={accountInfo.name}
        />
        <AccordionCard title="매치 이력" type="multiple" items={accordionItems}></AccordionCard>
        <Button className="w-full" onClick={() => fetchMatchData(accountInfo.puuid, matches.length)}>
          더 보기
        </Button>
      </div>
    )
  );
}
