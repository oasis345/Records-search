'use client';
import Leaderboard from '@/app/(game)/shared/components/leaderboard/Leaderboard';
import { leaderboardRegions } from '../model/regions';
import { gameModes } from '../model/gameModes';
import statsColumns from '../model/statsColumns';

export default function Page() {
  return (
    <Leaderboard
      queryParams={[
        { key: 'region', items: leaderboardRegions, value: 'pc-kakao' },
        { key: 'gameMode', items: gameModes, value: 'squad' },
      ]}
      columns={statsColumns}
    />
  );
}
