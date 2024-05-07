import { PageParams } from '@/app/intrefaces/intreface';
import Container from '@/app/(game)/shared/components/profile/ProfileContainer';
import { User } from '@/app/(game)/shared/model/user';
import gameServiceManager from '@/app/services/serviceManager';
import { PubgService } from '@/app/services/pubg.service';
import { PUBGMatchHistory } from './MatchHistory';

export default async function Page({ params }: { params: PageParams }) {
  const [region, searchText] = decodeURIComponent(params.slug.toString()).split(',');
  const service = await gameServiceManager.getService<PubgService>('pubg');
  let user: User | undefined;
  let matches: any[] = [];

  try {
    user = await service.findUser({ region, name: searchText });
    if (user) {
      matches = await service.getMatches({
        userId: user.id,
        region,
        matches: user?.data.relationships.matches.data.map((match: any) => match.id),
      });
    }
  } catch (error) {
    console.error('ProfileData is not Found');
  }

  return (
    <Container region={region} searchText={searchText} user={user}>
      <PUBGMatchHistory matchData={matches} />
    </Container>
  );
}
