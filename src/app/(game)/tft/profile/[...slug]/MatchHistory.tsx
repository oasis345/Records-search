'use client';
import MatchHistory from '@/app/(game)/shared/components/match/MatchHistory';
import { TFTMatchHistoryItemBuilder } from '../../model/match';
import { Match } from '@/app/(game)/shared/model/match';
import { httpService } from '@/app/services/httpService';
import { Summoner } from '@/app/(game)/shared/model/riot/interface';

export function TFTMatchHistory({
  matchData,
  region,
  summoner,
  resource,
}: {
  matchData: Match[];
  region: string;
  summoner: Summoner;
  resource: any;
}) {
  const fetchMatchData = async (startIndex: number) => {
    const result = await httpService.get<Match[]>({
      url: '/api/tft/matches',
      params: { region, puuid: summoner.puuid, start: startIndex },
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
