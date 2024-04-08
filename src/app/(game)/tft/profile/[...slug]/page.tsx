import NotFoundUserPage from '@/app/(game)/components/NotFoundPage';
import ProfileCard from '@/app/(game)/components/ProfileCard';
import { tftService } from '@/app/services/tft.service';
import Container from './components/Container';

export default async function Page({ params }: { params: { slug: string[] } }) {
  const [region, searchText] = decodeURIComponent(params.slug.toString()).split(',');
  let summoner;
  let matches;

  try {
    await tftService.init();
    summoner = await tftService.getSummoner({ name: searchText, region });
    matches = await tftService.getMatches({ puuid: summoner.puuid, region });
  } catch (error) {
    console.error(error);
  }

  return !summoner?.id ? (
    <NotFoundUserPage region={region} searchText={searchText} />
  ) : (
    matches && (
      <div className="container">
        <ProfileCard
          imageSrc={tftService.getImageUrl('profileIcon', summoner.profileIconId + '.png')}
          region={region}
          name={`${summoner.gameName}`}
          tag={summoner.tagLine}
        />
        <Container
          region={region}
          summoner={summoner}
          matches={matches}
          resource={{
            champions: tftService.champions,
            apiVersion: tftService.dragonApiVersion,
          }}
        />
      </div>
    )
  );
}
