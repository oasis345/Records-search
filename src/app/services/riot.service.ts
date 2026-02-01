import { Account } from '@/app/(game)/shared/model/riot/interface';
import { httpService } from './httpService';
import { GameService } from './gameService';

export abstract class RiotService extends GameService {
  apiVersion: string = '';
  protected abstract getApiKey(): string | undefined;

  async init() {
    this.apiVersion = await this.getLatestDragonApiVersion();
  }

  async getLatestDragonApiVersion() {
    try {
      const result = await httpService.get<string[]>({
        url: 'https://ddragon.leagueoflegends.com/api/versions.json',
        revalidate: 'day',
      });

      return result[0];
    } catch (error) {
      console.error('Failed to fetch dragon API version:', error);
      return '14.1.1'; // fallback version
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
    const encodedName = encodeURIComponent(name);
    const encodedTag = encodeURIComponent(tag);
    const result = await httpService.get<Account>({
      url: `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodedName}/${encodedTag}`,
      params: { api_key: this.getApiKey() },
    });

    return result;
  }

  protected async getAccountByPuuid(region: string, puuid: string): Promise<Account> {
    const result = await httpService.get<Account>({
      url: `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
      params: { api_key: this.getApiKey() },
    });

    return result;
  }
}
