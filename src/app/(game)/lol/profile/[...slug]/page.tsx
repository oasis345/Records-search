import { lolService } from '@/app/services/lol.service';
import { PageParams } from '@/app/intrefaces/intreface';
import Container from '@/app/(game)/shared/components/profile/ProfileContainer';
import { Account, Summoner } from '@/app/(game)/shared/model/riot/interface';
import { Match } from '@/app/(game)/shared/model/match';
import { LOLMatchHistory } from './MatchHistory';

export default async function Page({ params }: { params: PageParams }) {
  const [region, searchText] = decodeURIComponent(params.slug.toString()).split(',');
  let summoner: Summoner & Account;
  let matchData: Match[];

  await lolService.init();
  summoner = await lolService.getUser({ name: searchText, region });
  matchData = await lolService.getMatches({ puuid: summoner.puuid, region });

  // return !summoner?.id ? (
  //   <NotFoundUser region={region} searchText={searchText} />
  // ) : (
  //   matches && (
  //     <div className="container">
  //       <ProfileCard
  //         imageSrc={lolService.getImageUrl('profileIcon', summoner.profileIconId)}
  //         region={region}
  //         name={`${summoner.gameName}`}
  //         tag={summoner.tagLine}
  //       />
  //       <Container
  //         region={region}
  //         summoner={summoner}
  //         matches={matches}
  //         resource={{
  //           champions: lolService.champions,
  //           spells: lolService.spells,
  //           apiVersion: lolService.apiVersion,
  //         }}
  //       ></Container>
  //     </div>
  //   )
  // );
  return (
    <Container
      region={region}
      searchText={searchText}
      user={{
        name: summoner.gameName,
        profileIcon: lolService.getImageUrl('profileIcon', summoner.profileIconId),
        region,
        tag: summoner.tagLine,
      }}
    >
      <LOLMatchHistory
        matchData={matchData}
        region={region}
        summoner={summoner}
        resource={{
          champions: lolService.champions,
          spells: lolService.spells,
          apiVersion: lolService.apiVersion,
        }}
      />
    </Container>
  );
}
