import _ from 'lodash';
import { Match, Season } from '../(game)/pubg/model/interface';
import { PUBGMatch } from '../(game)/pubg/model/match';
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
  getUserStatistics<T extends GameStats>(findOption: { region: string; user: User }): Promise<T[] | undefined> {
    throw new Error('Method not implemented.');
  }
  async init(): Promise<void> {}

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

    return _.toPlainObject(user);
  }

  async getMatches({ userId, region, matches }: { userId: string; region: string; matches: string[] }) {
    const matchPromises = matches.map((id: string) => {
      const matchUrl = `${API_BASE_URL}/${region}/matches/${id}`;
      return httpService.get({ url: matchUrl, init: { headers } });
    });

    const response = await Promise.all(matchPromises);
    const matchesMap = response.map((match: Match) => {
      const item = {
        ...match,
        user: match.included
          .filter((item) => item.type === 'participant')
          .find((item) => item.attributes.stats.playerId === userId),
      };

      return _.toPlainObject(new PUBGMatch(item));
    });
    return matchesMap;
  }

  async getSeason(region: string) {
    const response = await httpService.get({ url: `${API_BASE_URL}/${region}/seasons`, init: { headers } });
    const data = response.data as Season[];

    return data;
  }

  async getLeaderboard({ region, gameMode }: { region: string; gameMode: string }): Promise<GameStats[] | undefined> {
    const seasons = await this.getSeason(region);
    const currentSeason = seasons.find((season) => season.attributes.isCurrentSeason);
    const response = await httpService.get({
      url: `${API_BASE_URL}/${region}/leaderboards/${currentSeason!.id}/${gameMode}`,
      init: { headers },
    });

    const data = response?.included?.map((user: any) => _.toPlainObject(new PubgStats(user)));
    return data;
  }
}

export const pubgService = new PubgService();
