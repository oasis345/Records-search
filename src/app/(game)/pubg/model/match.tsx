import { ReactNode } from 'react';
import { Match, MatchHistoryItemBuilder } from '../../shared/model/match';
import { Match as PUBGMatchInterface, Participant } from './interface';
import { gameModes } from './gameModes';
import { secondsToMinutes } from '@/app/utils';
import { mapList } from './mapList';

export class PUBGMatchHistoryItemBuilder extends MatchHistoryItemBuilder<PUBGMatch> {
  getContents(data: any): ReactNode {
    const { attributes } = data.data as PUBGMatchInterface;
    const userStats = data.user.attributes.stats;
    const { minutes: durationMinutes, remainingSeconds: durationSeconds } = secondsToMinutes(userStats.timeSurvived);

    return (
      <div className="w-full grid grid-cols-5 gap-1 text-sm">
        <div className="flex flex-col w-full">
          <span>{mapList.find((map) => map.name === attributes.mapName)?.label ?? attributes.mapName}</span>
          <span className="text-gray-400 text-xs">지도</span>
        </div>
        <div className="hidden md:flex flex-col w-full">
          <span>{`${durationMinutes}분 ${durationSeconds}초`}</span>
          <span className="text-gray-400 text-xs">생존시간</span>
        </div>
        <div className="flex flex-col w-full">
          <span>{userStats.kills}</span>
          <span className="text-gray-400 text-xs">킬</span>
        </div>
        <div className="flex flex-col w-full">
          <span>{userStats.assists}</span>
          <span className="text-gray-400 text-xs">어시스트</span>
        </div>
        <div className="flex flex-col w-full">
          <span>{Math.floor(userStats.damageDealt)}</span>
          <span className="text-gray-400 text-xs">데미지</span>
        </div>
      </div>
    );
  }
}

export class PUBGMatch extends Match {
  constructor(match: any) {
    const { attributes, id } = match.data as PUBGMatchInterface;
    const participants = match.included.filter((item: any) => item.type === 'participant');
    const userParticipants = match.included
      .filter((item: any) => item.type === 'roster')
      .find((roster: any) =>
        roster.relationships.participants.data.find((participant: Participant) => participant.id === match.user.id),
      ).relationships.participants.data;

    const team = participants
      .filter((participant: any) => userParticipants.find((item: Participant) => item.id === participant.id))
      .map((participant: any) => {
        return {
          name: participant.attributes.stats.name,
        };
      });

    super({
      creationTime: attributes.createdAt,
      durationTime: attributes.duration,
      id,
      participants: team,
      mode: gameModes.find((item) => item.name === attributes.gameMode)?.label,
      data: match,
    });
  }
}
