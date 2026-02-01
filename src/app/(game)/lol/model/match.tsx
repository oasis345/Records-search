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
  private currentMatch?: LOLMatch;

  getContents(data: LOLMatchInterface): ReactNode {
    const { user } = data;
    return <MainContent participant={user} match={data} resource={this.resource} />;
  }

  getClasses(): string {
    const isWin = this.currentMatch?.isWin;
    return isWin ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-red-500';
  }

  build(match: LOLMatch) {
    this.currentMatch = match;
    return super.build(match);
  }

  getSubContent(match: LOLMatch) {
    const { info, user } = match.data as LOLMatchInterface;
    const contents = createContentsByGameMode({
      participants: info.participants,
      mode: info.gameMode,
      match: match.data,
      resource: this.resource,
    });

    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        {contents.teams.map((team, teamIndex) => (
          <div key={teamIndex} className="flex flex-col gap-0.5">
            {team.participants.map((p) => {
              const isCurrentUser = p.puuid === user?.puuid;

              return (
                <div
                  key={p.puuid}
                  className={`flex items-center gap-1 px-1 py-0.5 rounded text-[11px] cursor-pointer hover:bg-muted/50 ${
                    isCurrentUser ? 'bg-primary/10 font-medium' : ''
                  }`}
                  onClick={() => {
                    const name = encodeURIComponent(`${p.riotIdGameName}#${p.riotIdTagline}`);
                    window.open(`/lol/profile/${info.platformId.toLowerCase()}/${name}`);
                  }}
                >
                  <img
                    src={lolService.getImageUrl('champion', p.championName, this.resource.apiVersion)}
                    alt=""
                    className="w-4 h-4 rounded"
                  />
                  <span className={`truncate w-16 ${isCurrentUser ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {p.riotIdGameName}
                  </span>
                </div>
              );
            })}
          </div>
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
    const { metadata, info, user } = match;

    super({
      creationTime: info.gameCreation,
      durationTime: info.gameDuration,
      id: metadata.matchId,
      participants: info.participants.map((participant) => ({ name: participant.puuid })),
      mode: gameModes.find((mode) => mode.key === info.gameMode)?.label ?? info.gameMode,
      isWin: user?.win ?? false,
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
  // 기본 teamIds는 [100, 200] (대부분의 게임모드)
  const teamIds = gameModes.find((gameMode) => gameMode.key === mode)?.teamIds ?? [100, 200];
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
