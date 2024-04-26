import { LOLService } from '@/app/services/lol.service';
import { PageParams } from '@/app/intrefaces/intreface';
import Container from '@/app/(game)/shared/components/profile/ProfileContainer';
import { Match } from '@/app/(game)/shared/model/match';
import { LOLMatchHistory } from './MatchHistory';
import { User } from '@/app/(game)/shared/model/user';
import gameServiceManager from '@/app/services/serviceManager';

export default async function Page({ params }: { params: PageParams }) {
  const [region, searchText] = decodeURIComponent(params.slug.toString()).split(',');
  const service = await gameServiceManager.getService<LOLService>('lol');
  let user: User | undefined;
  let matchData: Match[] | undefined;

  try {
    user = await service.findUser({ name: searchText, region });
    if (user) matchData = await service.getMatches({ puuid: user.data.puuid, region });
  } catch (error) {
    console.error('Not Found User');
  }

  return (
    <Container region={region} searchText={searchText} user={user}>
      <LOLMatchHistory
        matchData={matchData}
        user={user!}
        resource={{
          champions: service.champions,
          spells: service.spells,
          apiVersion: service.apiVersion,
        }}
      />
    </Container>
  );
}
