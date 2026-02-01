import Leaderboard from '@/app/(game)/shared/components/leaderboard/Leaderboard';
import { regions } from '@/app/(game)/shared/model/riot/regions';
import { tiers } from '@/app/(game)/shared/model/riot/tiers';
import statsColumns from '@/app/(game)/lol/model/statsColumns';
import gameServiceManager from '@/app/services/serviceManager';
import { LOLService } from '@/app/services/lol.service';
import { LoLStats } from '@lol/model/stats';

export default async function LeaderboardPage({ region, tier }: { region: string; tier: string }) {
  // 유효한 region/tier인지 검증
  const validRegion = regions.find((r) => r.name === region)?.name ?? 'kr';
  const validTier = tiers.find((t) => t.name === tier)?.name ?? 'challenger';

  const service = await gameServiceManager.getService<LOLService>('lol');
  let data: LoLStats[] = [];

  try {
    data = await service.getLeaderboard({ region: validRegion, tier: validTier });
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
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
