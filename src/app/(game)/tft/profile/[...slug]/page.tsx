import Container from '@/app/(game)/shared/components/profile/ProfileContainer';
import { TFTService, tftService } from '@/app/services/tft.service';
import { Match } from '@/app/(game)/shared/model/match';
import { User } from '@/app/(game)/shared/model/user';
import gameServiceManager from '@/app/services/serviceManager';
import dynamic from 'next/dynamic';
import { TFTStats } from '../../model/stats';
import StatsCard from '@/app/(game)/shared/components/profile/StatsCard';
import { queueType } from '../../model/queueType';
const TFTMatchHistory = dynamic(() => import('./MatchHistory'), { ssr: false });

export default async function Page({ params }: { params: { slug: string[] } }) {
  const [region, searchText] = decodeURIComponent(params.slug.toString()).split(',');
  const service = await gameServiceManager.getService<TFTService>('tft');
  let user: User | undefined;
  let matchData: Match[] | undefined;
  let statistics: TFTStats[] = [];
  try {
    user = await service.findUser({ name: searchText, region });
    if (user) {
      matchData = await service.getMatches({ puuid: user.data.puuid, region });
      statistics = await service.getUserStatistics({ region, user });
    }
  } catch (error) {
    console.error('Profile Data is not Found');
  }

  return (
    <Container region={region} searchText={searchText} user={user}>
      <div className="flex flex-col md:flex-row gap-2">
        {statistics.map((stats) => {
          const type = queueType.find((type) => type.key === stats.data.queueType);
          return <StatsCard key={type?.key} mode={type?.label ?? ''} stats={stats} />;
        })}
      </div>
      <TFTMatchHistory
        matchData={matchData}
        user={user!}
        resource={{
          champions: service.champions,
          augments: service.augments,
          traits: service.traits,
          apiVersion: service.apiVersion,
        }}
      />
    </Container>
  );
}
