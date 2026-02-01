import { TFTService } from '@/app/services/tft.service';
import { regions } from '../../shared/model/riot/regions';
import statsColumns from '../model/statsColumns';
import { tiers } from '../model/tiers';
import Leaderboard from '@/app/(game)/shared/components/leaderboard/Leaderboard';
import gameServiceManager from '@/app/services/serviceManager';
import { PageProps } from '@/app/intrefaces/intreface';
import { TFTStats } from '../model/stats';

// ISR: 30분마다 갱신
export const revalidate = 1800;

export default async function Page(props: PageProps) {
  const { searchParams } = props;
  const region = (searchParams?.region as string) ?? 'kr';
  const tier = (searchParams?.tier as string) ?? 'challenger';

  // 유효한 region/tier인지 검증
  const validRegion = regions.find((r) => r.name === region)?.name ?? 'kr';
  const validTier = tiers.find((t) => t.name === tier)?.name ?? 'challenger';

  const service = await gameServiceManager.getService<TFTService>('tft');
  let data: TFTStats[] = [];

  try {
    data = await service.getLeaderboard({ region: validRegion, tier: validTier });
  } catch (error) {
    console.error('Failed to fetch TFT leaderboard:', error);
    // 에러 발생 시 빈 배열 반환 (UI에서 처리)
  }

  return (
    <Leaderboard
      params={[
        { key: 'region', items: regions, value: validRegion },
        { key: 'tier', items: tiers, value: validTier },
      ]}
      data={data}
      columns={statsColumns}
    />
  );
}
