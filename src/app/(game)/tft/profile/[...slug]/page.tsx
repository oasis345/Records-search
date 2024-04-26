import Container from '@/app/(game)/shared/components/profile/ProfileContainer';
import { TFTService, tftService } from '@/app/services/tft.service';
import { TFTMatchHistory } from './MatchHistory';
import { Match } from '@/app/(game)/shared/model/match';
import { User } from '@/app/(game)/shared/model/user';
import gameServiceManager from '@/app/services/serviceManager';

export default async function Page({ params }: { params: { slug: string[] } }) {
  const [region, searchText] = decodeURIComponent(params.slug.toString()).split(',');
  const service = await gameServiceManager.getService<TFTService>('tft');
  let user: User | undefined;
  let matchData: Match[] | undefined;

  try {
    user = await service.findUser({ name: searchText, region });
    matchData = await service.getMatches({ puuid: user.data.puuid, region });
  } catch (error) {
    console.error('Profile Data is not Found');
  }

  return (
    <Container region={region} searchText={searchText} user={user}>
      <TFTMatchHistory
        matchData={matchData}
        user={user!}
        resource={{
          champions: service.champions,
          apiVersion: service.apiVersion,
        }}
      />
    </Container>
  );
}
