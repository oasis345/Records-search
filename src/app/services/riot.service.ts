import { Account } from '@/app/(game)/shared/model/riot/interface';
import { HttpService } from './httpService';
const API_KEY = process.env.LOL_API_KEY;

export abstract class RiotService extends HttpService {
  apiVersion: string = '';

  async init() {
    this.apiVersion = await this.getLatestDragonApiVersion();
  }

  async getLatestDragonApiVersion() {
    try {
      const result = await this.get<any[]>({
        url: 'https://ddragon.leagueoflegends.com/api/versions.json',
      });

      return result[0];
    } catch (error) {
      throw new Error('failed request dragonApiVersion');
    }
  }

  protected async getAccountByRiotId({
    region,
    name,
    tag,
  }: {
    region: string;
    name: string;
    tag: string;
  }): Promise<Account> {
    const result = await this.get<Account>({
      url: `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`,
      params: { api_key: API_KEY },
    });

    return result;
  }

  protected async getAccountByPuuid(region: string, puuid: string): Promise<Account> {
    const result = await this.get<Account>({
      url: `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
      params: { api_key: API_KEY },
    });

    return result;
  }
}
