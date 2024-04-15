import { regions } from '../../shared/model/riot/regions';
import { tiers } from '../model/tiers';
import LeaderBoard from '@/app/(game)/shared/components/leaderboard/Leaderboard';

export default function Page() {
  return (
    <LeaderBoard
      queryParams={[
        { key: 'region', items: regions, value: 'kr' },
        { key: 'tier', items: tiers, value: 'challenger' },
      ]}
      sort={[{ id: 'score', desc: true }]}
    />
  );
}
