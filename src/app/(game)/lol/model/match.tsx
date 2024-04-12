import { ReactNode } from 'react';
import { Match, MatchHistoryItemBuilder } from '../../shared/model/match';
import { ApiResource, Match as LOLMatchInterface, Participant, TeamStats } from './interface';
import { lolService } from '@/app/services/lol.service';
import { gameModes } from './gameModes';
import MainContent from '../profile/[...slug]/components/MainConent';
import Detail from '../profile/[...slug]/components/Detail';
import { List } from '@/app/components/list/List';

interface Team {
  participants: Participant[];
  stats: TeamStats;
}

export class LOLMatchHistoryItemBuilder extends MatchHistoryItemBuilder<LOLMatch> {
  getContents(data: LOLMatchInterface): ReactNode {
    const { user } = data;
    return <MainContent participant={user} match={data} resource={this.resource} />;
  }

  getSubContent(match: LOLMatch) {
    const { info } = match.data as LOLMatchInterface;
    const contents = createContentsByGameMode({
      participants: info.participants,
      mode: info.gameMode,
      match: match.data,
      resource: this.resource,
    });

    return (
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
                lolService.getImageUrl('champion', item.championName, this.resource.apiVersion),
              size: 18,
            }}
            onItemClick={(item) => {
              const name = encodeURIComponent(`${item.riotIdGameName}#${item.riotIdTagline}`);
              // window.open(`/lol/profile/${region}/${name}`);
            }}
          />
        ))}
      </div>
    );
  }

  getDetail(match: LOLMatchInterface) {
    const { info } = match;
    const contents = createContentsByGameMode({
      participants: info.participants,
      mode: info.gameMode,
      match,
      resource: this.resource,
    });

    return contents.contents;
  }
}

export class LOLMatch extends Match {
  constructor(match: LOLMatchInterface) {
    const { metadata, info } = match;

    super({
      creationTime: info.gameCreation,
      durationTime: info.gameDuration,
      id: metadata.matchId,
      participants: info.participants.map((participant) => ({ name: participant.puuid })),
      mode: gameModes.find((mode) => mode.key === info.gameMode)?.label ?? info.gameMode,
      data: match,
    });
  }
}

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
  match: LOLMatchInterface;
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
        <Detail key={index} match={match} participants={team.participants} teamStats={team.stats} resource={resource} />
      ));
      break;

    default:
      teams = getSeparatedTeams(participants, teamIds, (participant, id) => participant.teamId === id);
      contents = (
        <div className="flex flex-col md:flex-row lg:flex-row">
          {teams.map((team: Team, index: number) => (
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
