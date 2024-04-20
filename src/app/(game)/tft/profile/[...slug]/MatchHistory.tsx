'use client';
import MatchHistory from '@/app/(game)/shared/components/match/MatchHistory';
import { TFTMatchHistoryItemBuilder } from '../../model/match';
import { Match } from '@/app/(game)/shared/model/match';
import { httpService } from '@/app/services/httpService';
import { User } from '@/app/(game)/shared/model/user';

export function TFTMatchHistory({
  matchData = [],
  user,
  resource,
}: {
  matchData?: Match[];
  user: User;
  resource: any;
}) {
  const fetchMatchData = async (startIndex: number) => {
    const result = await httpService.get<Match[]>({
      url: '/api/tft/matches',
      params: { region: user.region, puuid: user.data.puuid, start: startIndex },
    });

    return result;
  };

  return (
    <MatchHistory
      matchData={matchData}
      itemBuilder={TFTMatchHistoryItemBuilder}
      resource={resource}
      fetchMatchData={fetchMatchData}
    />
  );
}
