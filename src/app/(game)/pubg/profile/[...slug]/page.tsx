import Container from '@/app/(game)/shared/components/profile/ProfileContainer';
import { User } from '@/app/(game)/shared/model/user';
import gameServiceManager from '@/app/services/serviceManager';
import { PubgService } from '@/app/services/pubg.service';
import PUBGMatchHistory from './MatchHistory';
import { PageProps } from '@/app/intrefaces/intreface';
import { decodeSearchParams } from '@/app/utils';
import { generateProfileMetadata } from '@/app/utils/generateMetadata';

export async function generateMetadata(pageProps: PageProps) {
  return generateProfileMetadata(pageProps);
}

export default async function Page({ params }: PageProps) {
  const [region, searchText] = decodeSearchParams(params.slug);
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
