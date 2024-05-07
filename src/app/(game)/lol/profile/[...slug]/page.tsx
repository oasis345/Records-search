import { LOLService } from '@/app/services/lol.service';
import { PageParams } from '@/app/intrefaces/intreface';
import Container from '@/app/(game)/shared/components/profile/ProfileContainer';
import { Match } from '@/app/(game)/shared/model/match';
import { LOLMatchHistory } from './MatchHistory';
import { User } from '@/app/(game)/shared/model/user';
import gameServiceManager from '@/app/services/serviceManager';
import StatsCard from '@/app/(game)/shared/components/profile/StatsCard';
import { LoLStats } from '../../model/stats';
import { queueType } from '../../model/queueType';

export default async function Page({ params }: { params: PageParams }) {
  const [region, searchText] = decodeURIComponent(params.slug.toString()).split(',');
  const service = await gameServiceManager.getService<LOLService>('lol');
  let user: User | undefined;
  let matchData: Match[] | undefined;
  let statistics: LoLStats[] = [];

  try {
    user = await service.findUser({ name: searchText, region });
    if (user) {
      matchData = await service.getMatches({ puuid: user.data.puuid, region });
      statistics = await service.getUserStatistics({ region, user });
    }
  } catch (error) {
    console.error('Not Found User');
  }

  return (
    <Container region={region} searchText={searchText} user={user}>
      <div className="flex flex-col w-full gap-2">
        <div className="flex flex-col md:flex-row gap-2">
          {statistics.map((stats) => {
            const type = queueType.find((type) => type.key === stats.data.queueType);
            return <StatsCard key={type?.key} mode={type?.label ?? ''} stats={stats} />;
          })}
        </div>
        <div>
          <LOLMatchHistory
            matchData={matchData}
            user={user!}
            resource={{
              champions: service.champions,
              spells: service.spells,
              apiVersion: service.apiVersion,
            }}
          />
        </div>
      </div>
    </Container>
  );
}
