import Leaderboard from '@/app/(game)/shared/components/leaderboard/Leaderboard';
import { leaderboardRegions } from '../model/regions';
import { gameModes } from '../model/gameModes';
import statsColumns from '../model/statsColumns';
import { PageProps } from '@/app/intrefaces/intreface';
import { PubgService } from '@/app/services/pubg.service';
import gameServiceManager from '@/app/services/serviceManager';

export default async function Page(props: PageProps) {
  const { searchParams } = props;
  const region = searchParams?.region ?? 'pc-kakao';
  const gameMode = searchParams?.gameMode ?? 'squad';
  const service = await gameServiceManager.getService<PubgService>('pubg');
  const data = await service.getLeaderboard({ region, gameMode });

  return (
    <Leaderboard
      queryParams={[
        { key: 'region', items: leaderboardRegions, value: 'pc-kakao' },
        { key: 'gameMode', items: gameModes, value: 'squad' },
      ]}
      columns={statsColumns}
      data={data}
    />
  );
}
