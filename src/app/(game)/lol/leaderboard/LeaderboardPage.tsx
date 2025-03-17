import Leaderboard from '@/app/(game)/shared/components/leaderboard/Leaderboard';
import { regions } from '@/app/(game)/shared/model/riot/regions';
import { tiers } from '@/app/(game)/shared/model/riot/tiers';
import statsColumns from '@/app/(game)/lol/model/statsColumns';
import gameServiceManager from '@/app/services/serviceManager';
import { LOLService } from '@/app/services/lol.service';

export default async function LeaderboardPage({ region, tier }: { region: string; tier: string }) {
  const service = await gameServiceManager.getService<LOLService>('lol');
  const data = await service.getLeaderboard({ region, tier });

  return (
    <Leaderboard
      params={[
        { key: 'region', items: regions, value: region },
        { key: 'tier', items: tiers, value: tier },
      ]}
      data={data}
      columns={statsColumns}
    />
  );
}
