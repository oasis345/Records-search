import { regions } from '@/app/(game)/shared/model/riot/regions';
import { tiers } from '@/app/(game)/shared/model/riot/tiers';
import LeaderboardPage from '../../LeaderboardPage';

export const revalidate = 1800; // 30분마다 갱신
export const dynamic = 'force-static'; // ISR 적용

export function generateStaticParams() {
  const regionsMap = regions.map((region) => region.name);
  const tiersMap = tiers.map((tier) => tier.name);

  return regionsMap.flatMap((region) => tiersMap.map((tier) => ({ region, tier })));
}

export default function Page({ params }: { params: { region: string; tier: string } }) {
  return <LeaderboardPage region={params.region} tier={params.tier} />;
}
