import { regions } from '../../shared/model/riot/regions';
import { tiers } from '../model/tiers';
import Leaderboard from '@/app/(game)/shared/components/leaderboard/Leaderboard';

export default function Page() {
  return (
    <Leaderboard
      queryParams={[
        { key: 'region', items: regions, value: 'kr' },
        { key: 'tier', items: tiers, value: 'challenger' },
      ]}
    />
  );
}
