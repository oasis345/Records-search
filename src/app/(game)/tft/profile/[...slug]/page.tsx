import { Account, Summoner } from '@/app/(game)/shared/model/riot/interface';
import Container from '@/app/(game)/shared/components/profile/ProfileContainer';
import { tftService } from '@/app/services/tft.service';
import { TFTMatchHistory } from './MatchHistory';
import { Match } from '@/app/(game)/shared/model/match';

export default async function Page({ params }: { params: { slug: string[] } }) {
  const [region, searchText] = decodeURIComponent(params.slug.toString()).split(',');
  let summoner: Summoner & Account;
  let matchData: Match[];

  await tftService.init();
  summoner = await tftService.getSummoner({ name: searchText, region });
  matchData = await tftService.getMatches({ puuid: summoner.puuid, region });

  return (
    <Container
      region={region}
      searchText={searchText}
      user={{
        name: summoner.gameName,
        profileIcon: tftService.getImageUrl('profileIcon', summoner.profileIconId),
        region,
        tag: summoner.tagLine,
      }}
    >
      <TFTMatchHistory
        matchData={matchData}
        region={region}
        summoner={summoner}
        resource={{
          champions: tftService.champions,
          apiVersion: tftService.apiVersion,
        }}
      />
    </Container>
  );
}
