'use client';
import MatchHistory from '@/app/(game)/shared/components/match/MatchHistory';
import { Match } from '@/app/(game)/shared/model/match';
import { PUBGMatchHistoryItemBuilder } from '../../model/match';

export function PUBGMatchHistory({ matchData = [], resource }: { matchData?: Match[]; resource?: any }) {
  return (
    <MatchHistory
      matchData={matchData}
      itemBuilder={PUBGMatchHistoryItemBuilder}
      resource={resource}
      disableFetch={true}
    />
  );
}
