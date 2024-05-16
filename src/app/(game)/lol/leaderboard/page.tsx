import Leaderboard from '@/app/(game)/shared/components/leaderboard/Leaderboard';
import { regions } from '../../shared/model/riot/regions';
import { tiers } from '../../shared/model/riot/tiers';
import statsColumns from '../model/statsColumns';
import gameServiceManager from '@/app/services/serviceManager';
import { LOLService } from '@/app/services/lol.service';
import { PageProps } from '@/app/intrefaces/intreface';

export default async function Page(props: PageProps) {
  const { searchParams } = props;
  const region = searchParams?.region ?? 'kr';
  const tier = searchParams?.tier ?? 'challenger';
  const service = await gameServiceManager.getService<LOLService>('lol');
  const data = await service.getLeaderboard({ region, tier });

  return (
    <Leaderboard
      queryParams={[
        { key: 'region', items: regions, value: region },
        { key: 'tier', items: tiers, value: tier },
      ]}
      data={data}
      columns={statsColumns}
    />
  );
}
