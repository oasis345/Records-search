import { LOLService } from '@/app/services/lol.service';
import { PageProps } from '@/app/intrefaces/intreface';
import ProfileContainer from '@/app/(game)/shared/components/profile/ProfileContainer';
import { Match } from '@/app/(game)/shared/model/match';
import { User } from '@/app/(game)/shared/model/user';
import gameServiceManager from '@/app/services/serviceManager';
import StatsCard from '@/app/(game)/shared/components/profile/StatsCard';
import { LoLStats } from '@lol/model/stats';
import { queueType } from '../../model/queueType';
import { generateProfileMetadata } from '@/app/meta/generateMetadata';
import { decodeSearchParams } from '@/app/utils';
import { MatchSkeleton } from '@/app/(game)/shared/components/match/MatchSkeleton';
import LOLMatchHistory from './MatchHistory';
import { Suspense } from 'react';

export async function generateMetadata(pageProps: PageProps) {
  return generateProfileMetadata(pageProps);
}

export default async function Page({ params }: PageProps) {
  const [region, searchText] = decodeSearchParams(params.slug);
  const service = await gameServiceManager.getService<LOLService>('lol');
  let user: User | undefined;
  let matchData: Match[] | undefined;
  let statisticsData: LoLStats[] | undefined = [];

  try {
    user = await service.findUser({ name: searchText, region });
    if (user) {
      const [matches, statistics] = await Promise.all([
        service.getMatches({ puuid: user.data.puuid, region }),
        service.getUserStatistics({ region, user }),
      ]);
      matchData = matches;
      statisticsData = statistics;
    }
  } catch (error) {
    console.error('Not Found User');
  }

  return (
    <div className="flex flex-col w-full gap-2">
      <Suspense fallback={<h1>profile..</h1>}>
        <ProfileContainer region={region} searchText={searchText} user={user}>
          <section className="flex flex-col md:flex-row gap-2">
            {statisticsData?.map((stats) => {
              const type = queueType.find((type) => type.key === stats.data.queueType);
              return <StatsCard key={type?.key} mode={type?.label ?? ''} stats={stats} />;
            })}
          </section>
        </ProfileContainer>
      </Suspense>

      <Suspense fallback={<MatchSkeleton />}>
        <LOLMatchHistory
          matchData={matchData}
          user={user!}
          resource={{
            champions: service.champions,
            spells: service.spells,
            apiVersion: service.apiVersion,
          }}
        />
      </Suspense>
    </div>
  );
}
