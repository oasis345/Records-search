'use client';
import React, { useEffect, useState } from 'react';
import { gameModes } from '../../../model/gameModes';
import { AccordionCard } from '@/app/components/card/AccordionCard';
import { Summoner, Match, Participant, TeamStats, ApiResource } from '../../../model/interface';
import MainContent from './MainConent';
import MatchResult from '../../../../components/MatchResult';
import Detail from './Detail';
import { httpService } from '@/app/services/httpService';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { List } from '@/app/components/list/List';
import { lolService } from '@/app/services/lol.service';

interface Team {
  participants: Participant[];
  stats: TeamStats;
}

export default function Container({
  region,
  summoner,
  matches: initialMatches,
  resource,
}: {
  region: string;
  summoner: Summoner;
  matches: Match[];
  resource: ApiResource;
}) {
  const [accordionItems, setAccordionItems] = React.useState<AccordionCardItemProps[]>([]);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAccordionItems([...createAccordionItems(matches)]);
  }, [matches]);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const result = await httpService.get<Match[]>({
        url: '/api/lol/matches',
        params: { region, puuid: summoner.puuid, start: matches.length },
      });

      setMatches([...matches, ...result]);
      setIsLoading(false);
    } catch (error) {
      throw new Error('failed get Matches.');
    }
  };

  const createAccordionItems = (matches: Match[]) => {
    return matches.map((match) => {
      const {
        metadata: { matchId },
        info: { participants, ...info },
      } = match;
      const myInfo = match.info.participants.find((participant) => participant.puuid === summoner?.puuid)!;
      const contents = createContentsByGameMode({
        participants,
        mode: info.gameMode,
        match,
        resource,
      });

      return {
        itemKey: matchId,
        item: match,
        classes: 'h-28',
        header: (
          <MatchResult
            matchResult={{
              creationTime: info.gameCreation,
              durationTime: info.gameDuration,
              isWin: myInfo.win,
              mode: gameModes.find((mode) => mode.key === info.gameMode)?.label ?? info.gameMode,
            }}
          />
        ),
        content: <MainContent participant={myInfo} match={match} resource={resource} />,
        subContent: (
          <div className="w-full grid grid-cols-2 gap-2">
            {contents.teams.map((team, index) => (
              <List
                key={index}
                items={team.participants}
                keyField="puuid"
                valueField="riotIdGameName"
                classes="hidden lg:grid md:grid"
                itemClasses="flex w-28 text-xs"
                imageOptions={{
                  getImageSrc: (item: Participant) =>
                    lolService.getImageUrl('champion', item.championName, resource.apiVersion),
                  size: 18,
                }}
                onItemClick={(item) => {
                  const name = encodeURIComponent(`${item.riotIdGameName}#${item.riotIdTagline}`);
                  window.open(`/lol/profile/${region}/${name}`);
                }}
              />
            ))}
          </div>
        ),
        detail: contents.contents,
      };
    });
  };

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

  const createContentsByGameMode = ({
    participants,
    mode,
    match,
    resource,
  }: {
    participants: Participant[];
    mode: string;
    match: Match;
    resource: ApiResource;
  }) => {
    let teamIds = gameModes.find((gameMode) => gameMode.key === mode)?.teamIds!;
    if (!teamIds) throw new Error('지원되지 않는 게임모드');
    let teams;
    let contents;

    switch (mode) {
      case 'CHERRY':
        teams = getSeparatedTeams(participants, teamIds, (participant, id) => participant.playerSubteamId === id);
        contents = teams.map((team: Team, index: number) => (
          <Detail
            key={index}
            match={match}
            participants={team.participants}
            teamStats={team.stats}
            resource={resource}
          />
        ));
        break;

      default:
        teams = getSeparatedTeams(participants, teamIds, (participant, id) => participant.teamId === id);
        contents = (
          <div className="flex flex-col md:flex-row lg:flex-row">
            {teams.map((team: any, index: number) => (
              <Detail
                key={index}
                match={match}
                participants={team.participants}
                teamStats={team.stats}
                resource={resource}
              />
            ))}
          </div>
        );
    }

    return { teams, contents };
  };

  return (
    <div>
      <AccordionCard title="매치 이력" type="multiple" items={accordionItems}></AccordionCard>
      <Button disabled={isLoading} className="w-full" onClick={fetchMatches}>
        {isLoading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : `더 보기`}
      </Button>
    </div>
  );
}
