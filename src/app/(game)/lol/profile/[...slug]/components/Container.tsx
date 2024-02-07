'use client';
import React, { useEffect, useState } from 'react';
import { gameModes } from '../../../model/gameModes';
import { AccordionCard } from '@/app/components/card/AccordionCard';
import { Summoner, Match, Participant, TeamStats, RiotApiResource } from '../../../model/interface';
import MainContent from './MainConent';
import MatchResult from './MatchResult';
import ParticipantList from './ParticipantList';
import Detail from './Detail';
import { httpService } from '@/app/services/httpService';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

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
  resource: RiotApiResource;
}) {
  const [accordionItems, setAccordionItems] = React.useState<AccordionCardItemProps[]>([]);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAccordionItems([...createAccordionItems(matches, summoner)]);
  }, []);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      const result = await httpService.get<Match[]>({
        url: '/api/lol/matches',
        params: { region, puuid: summoner.puuid, start: matches.length },
      });

      setMatches([...matches, ...matches]);
      setAccordionItems([...accordionItems, ...createAccordionItems(result, summoner)]);
      setIsLoading(false);
    } catch (error) {
      throw new Error('failed get Matches.');
    }
  };

  const createAccordionItems = (matches: Match[], summoner: Summoner) => {
    return matches.map((match) => {
      const {
        metadata: { matchId },
        info: { participants, ...info },
      } = match;
      const myInfo = match.info.participants.find((participant) => participant.puuid === summoner?.puuid)!;
      const teamIdsByMode = gameModes.find((mode) => mode.key === 'CLASSIC')?.teamIds!;
      const teams = getSeparatedTeams(participants, teamIdsByMode, (participant, id) => participant.teamId === id);

      return {
        key: matchId,
        item: match,
        header: <MatchResult match={match} participant={myInfo} />,
        content: <MainContent participant={myInfo} match={match} resource={resource} />,
        subContent: teams.map((team, index) => (
          <ParticipantList key={index} participants={team.participants} resource={resource} region={region} />
        )),
        detail: createContentsByGameMode({
          participants,
          mode: info.gameMode,
          match,
          resource,
        }),
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
    resource: RiotApiResource;
  }) => {
    switch (mode) {
      case 'CHERRY':
        const cherryModeTeamIds: number[] = gameModes.find((gameMode) => gameMode.key === mode)?.teamIds!;
        const cherryModeTeams = getSeparatedTeams(
          participants,
          cherryModeTeamIds,
          (participant, id) => participant.playerSubteamId === id,
        );

        return cherryModeTeams.map((team: Team, index: number) => (
          <Detail
            key={index}
            match={match}
            participants={team.participants}
            teamStats={team.stats}
            resource={resource}
          />
        ));

      default:
        const classicModeTeamIds: number[] = gameModes.find((gameMode) => gameMode.key === mode)?.teamIds!;
        const classicModeTeams = getSeparatedTeams(
          participants,
          classicModeTeamIds,
          (participant, id) => participant.teamId === id,
        );

        return (
          <div className="flex flex-col md:flex-row lg:flex-row">
            {classicModeTeams.map((team: any, index: number) => (
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
