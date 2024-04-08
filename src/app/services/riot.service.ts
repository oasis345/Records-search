import { HttpService } from './httpService';
const API_KEY = process.env.LOL_API_KEY;

export abstract class RiotService extends HttpService {
  dragonApiVersion: string = '';

  async init() {
    this.dragonApiVersion = await this.getLatestDragonApiVersion();
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
  }): Promise<Record<string, any>> {
    const result = await this.get<Record<string, any>>({
      url: `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`,
      params: { api_key: API_KEY },
    });

    return result;
  }

  protected async getAccountByPuuid(region: string, puuid: string): Promise<Record<string, any>> {
    const result = await this.get<Record<string, any>>({
      url: `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
      params: { api_key: API_KEY },
    });

    return result;
  }
}
