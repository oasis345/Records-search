'use client';
import LeaderBoard from '@/app/(game)/shared/components/leaderboard/Leaderboard';
import { regions } from '../model/regions';
import { gameModes } from '../model/gameModes';
import statsColumns from '../model/statsColumns';

export default function Page() {
  return (
    <LeaderBoard
      queryParams={[
        { key: 'region', items: regions, value: 'pc-kakao' },
        { key: 'gameMode', items: gameModes, value: 'squad' },
      ]}
      columns={statsColumns}
    />
  );
}
