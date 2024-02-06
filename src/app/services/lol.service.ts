import { regions } from '@/app/(game)/lol/model/regions';
import { HttpService } from './httpService';
import { riotService } from './riot.service';
import _ from 'lodash';

const API_KEY = process.env.LOL_API_KEY;
const API_BASE_URL = 'api.riotgames.com/lol';

class LOLService extends HttpService {
  async getRanked({ region, tier }: { region: string; tier: string }): Promise<any[]> {
    const url = `https://${region}.${API_BASE_URL}/league-exp/v4/entries/RANKED_SOLO_5x5/${tier}/I`;
    return await this.get({ url, params: { api_key: API_KEY } });
  }

  async getSummoner({ region, name }: { region: string; name: string }): Promise<Record<string, any>> {
    const continent = regions.find((item) => item.name === region)!.continent;
    const [summonerName, tag] = name.split('#');
    let result: Record<string, any> = {};

    if (summonerName && tag) {
      const account = await riotService.getAccountByRiotId({ region: continent, name: summonerName, tag });
      const summoner = await this.get<Record<string, any>>({
        url: `https://${region}.${API_BASE_URL}/summoner/v4/summoners/by-puuid/${account.puuid}`,
        params: { api_key: API_KEY },
      });

      result = _.merge(account, summoner);
    } else if (summonerName) {
      const summoner = await this.get<Record<string, any>>({
        url: `https://${region}.${API_BASE_URL}/summoner/v4/summoners/by-name/${summonerName}`,
        params: { api_key: API_KEY },
      });
      const account = await riotService.getAccountByPuuid(continent, summoner.puuid);

      result = _.merge(account, summoner);
    }

    return result;
  }

  async getMatches(puuid: string, region: string, start?: string): Promise<any[]> {
    const matchIds = await this.get<string[]>({
      url: `https://${region}.${API_BASE_URL}/match/v5/matches/by-puuid/${puuid}/ids`,
      params: { start, count: 20, api_key: API_KEY },
    });

    const matchPromises = matchIds.map((matchId: string) => {
      const matchUrl = `https://${region}.${API_BASE_URL}/match/v5/matches/${matchId}`;
      return this.get({ url: matchUrl, params: { api_key: API_KEY } });
    });

    const result = await Promise.all(matchPromises);
    return result;
  }

  async getRotationChampions(): Promise<any[]> {
    const url = `https://kr.${API_BASE_URL}/platform/v3/champion-rotations`;
    return await this.get({ url, params: { api_key: API_KEY } });
  }
}

export const lolService = new LOLService();
