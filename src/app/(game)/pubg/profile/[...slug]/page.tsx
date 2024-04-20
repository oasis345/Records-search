import { PageParams } from '@/app/intrefaces/intreface';
import Container from '@/app/(game)/shared/components/profile/ProfileContainer';
import { User } from '@/app/(game)/shared/model/user';
import { gameServiceManager } from '@/app/services/serviceManager';
import { PubgService } from '@/app/services/pubg.service';

export default async function Page({ params }: { params: PageParams }) {
  const [region, searchText] = decodeURIComponent(params.slug.toString()).split(',');
  const service = gameServiceManager.getService<PubgService>('pubg');
  let user: User | undefined;

  try {
    user = await service.findUser({ region, name: searchText });
  } catch (error) {
    console.error('ProfileData is not Found');
  }

  return <Container region={region} searchText={searchText} user={user}></Container>;
}
