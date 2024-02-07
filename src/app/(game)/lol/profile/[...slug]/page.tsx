import { lolService } from '@/app/services/lol.service';
import NotFoundUserPage from '@/app/(game)/components/NotFoundPage';
import Container from './components/Container';
import { riotService } from '@/app/services/riot.service';
import ProfileCard from '@/app/(game)/components/ProfileCard';

export default async function Page({ params }: { params: { slug: string[] } }) {
  const [region, searchText] = decodeURIComponent(params.slug.toString()).split(',');
  let summoner;
  let matches;

  try {
    summoner = await lolService.getSummoner({ name: searchText, region });
    matches = await lolService.getMatches({ puuid: summoner.puuid, region });
    await riotService.init();
  } catch (error) {
    console.error(error);
  }

  return !summoner?.id ? (
    <NotFoundUserPage region={region} searchText={searchText} />
  ) : (
    matches && (
      <div className="container">
        <ProfileCard
          imageSrc={riotService.getImageUrl('profileIcon', summoner.profileIconId)}
          region={region}
          name={`${summoner.gameName}`}
          tag={summoner.tagLine}
        />
        <Container
          region={region}
          summoner={summoner}
          matches={matches}
          resource={{
            champions: riotService.champions,
            spells: riotService.spells,
            apiVersion: riotService.dragonApiVersion,
          }}
        ></Container>
      </div>
    )
  );
}
