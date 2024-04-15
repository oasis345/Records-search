'use client';
import { regions } from '../../shared/model/riot/regions';
import { tiers } from '../../shared/model/riot/tiers';
import LeaderBoard from '../../shared/components/leaderboard/Leaderboard';
import statsColumns from '../model/statsColumns';

export default function Page() {
  return (
    <LeaderBoard
      queryParams={[
        { key: 'region', items: regions, value: 'kr' },
        { key: 'tier', items: tiers, value: 'challenger' },
      ]}
      columns={statsColumns}
    />
  );
}
