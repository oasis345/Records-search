import { Season } from '../(game)/pubg/model/season';
import { PubgStats } from '../(game)/pubg/model/stats';
import { GameStats } from '../(game)/shared/model/gameStats';
import { User } from '../(game)/shared/model/user';
import { GameService } from './gameService';
import { httpService } from './httpService';

const API_KEY = process.env.PUBG_API_KEY;
const API_BASE_URL = 'https://api.pubg.com/shards';
const headers = {
  Authorization: `Bearer ${API_KEY}`,
  Accept: 'application/vnd.api+json',
};

export class PubgService extends GameService {
  async init(): Promise<void> {
    console.log('pubg service init.');
  }

  async findUser({ region, name }: { region: string; name: string }): Promise<User | undefined> {
    let user: User | undefined;
    const response = await httpService.get({
      url: `${API_BASE_URL}/${region}/players?filter[playerNames]=${name}`,
      init: { headers },
    });

    if (response) {
      const player = response.data[0];
      user = new User({
        id: player.id,
        data: player,
        name: player.attributes.name,
        region: player.attributes.shardId,
      });
    }

    return user;
  }

  async getSeason(region: string) {
    const response = await httpService.get({ url: `${API_BASE_URL}/${region}/seasons`, init: { headers } });
    const data = response.data as Season[];

    return data;
  }

  async getLeaderBoard({ region, gameMode }: { region: string; gameMode: string }): Promise<GameStats[] | undefined> {
    const seasons = await this.getSeason(region);
    const currentSeason = seasons.find((season) => season.attributes.isCurrentSeason);
    const response = await httpService.get<any>({
      url: `${API_BASE_URL}/${region}/leaderboards/${currentSeason!.id}/${gameMode}`,
      init: { headers },
    });

    const data = response.included.map((user: any) => new PubgStats(user)) as GameStats[];
    return data;
  }
}

export const pubgService = new PubgService();
