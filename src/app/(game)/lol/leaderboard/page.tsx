'use client';
import Leaderboard from '@/app/(game)/shared/components/leaderboard/Leaderboard';
import { regions } from '../../shared/model/riot/regions';
import { tiers } from '../../shared/model/riot/tiers';
import statsColumns from '../model/statsColumns';

export default function Page() {
  return (
    <Leaderboard
      queryParams={[
        { key: 'region', items: regions, value: 'kr' },
        { key: 'tier', items: tiers, value: 'challenger' },
      ]}
      columns={statsColumns}
    />
  );
}
