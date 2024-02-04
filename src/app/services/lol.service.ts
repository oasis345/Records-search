import { HttpService } from './httpService';

const API_KEY = process.env.LOL_API_KEY;
const LOL_API_BASE_URL = 'api.riotgames.com/lol';

class LolService extends HttpService {
  async getRanked({ region, tier }: { region: string; tier: string }): Promise<any[]> {
    const url = `https://${region}.${LOL_API_BASE_URL}/league-exp/v4/entries/RANKED_SOLO_5x5/${tier}/I`;
    return await this.get({ url, params: { api_key: API_KEY } });
  }

  async getSummoner({ region, name }: { region: string; name: string }): Promise<Record<string, any>> {
    const url = `https://${region}.${LOL_API_BASE_URL}/summoner/v4/summoners/by-name/${name}`;
    return await this.get({ url, params: { api_key: API_KEY } });
  }

  async getMatches(puuid: string, region: string, start?: string): Promise<any[]> {
    const matchIds = await this.get<string[]>({
      url: `https://${region}.${LOL_API_BASE_URL}/match/v5/matches/by-puuid/${puuid}/ids`,
      params: { start, count: 6, api_key: API_KEY },
    });

    const matchPromises = matchIds.map((matchId: string) => {
      const matchUrl = `https://${region}.${LOL_API_BASE_URL}/match/v5/matches/${matchId}`;
      return this.get({ url: matchUrl, params: { api_key: API_KEY } });
    });

    const result = await Promise.all(matchPromises);
    return result;
  }
}

export const lolService = new LolService();
