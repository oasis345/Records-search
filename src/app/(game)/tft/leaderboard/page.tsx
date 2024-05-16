import { TFTService } from '@/app/services/tft.service';
import { regions } from '../../shared/model/riot/regions';
import statsColumns from '../model/statsColumns';
import { tiers } from '../model/tiers';
import Leaderboard from '@/app/(game)/shared/components/leaderboard/Leaderboard';
import gameServiceManager from '@/app/services/serviceManager';
import { PageProps } from '@/app/intrefaces/intreface';

export default async function Page(props: PageProps) {
  const { searchParams } = props;
  const region = searchParams?.region ?? 'kr';
  const tier = searchParams?.tier ?? 'challenger';
  const service = await gameServiceManager.getService<TFTService>('tft');
  const data = await service.getLeaderboard({ region, tier });

  return (
    <Leaderboard
      queryParams={[
        { key: 'region', items: regions, value: 'kr' },
        { key: 'tier', items: tiers, value: 'challenger' },
      ]}
      data={data}
      columns={statsColumns}
    />
  );
}
