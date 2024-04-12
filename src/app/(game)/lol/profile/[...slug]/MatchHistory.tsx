'use client';
import MatchHistory from '@/app/(game)/shared/components/match/MatchHistory';
import { LOLMatchHistoryItemBuilder } from '../../model/match';
import { Match } from '@/app/(game)/shared/model/match';
import { httpService } from '@/app/services/httpService';
import { Summoner } from '@/app/(game)/shared/model/riot/interface';

export function LOLMatchHistory({
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
      url: '/api/lol/matches',
      params: { region, puuid: summoner.puuid, start: startIndex },
    });

    return result;
  };

  return (
    <MatchHistory
      matchData={matchData}
      itemBuilder={LOLMatchHistoryItemBuilder}
      resource={resource}
      fetchMatchData={fetchMatchData}
    />
  );
}
