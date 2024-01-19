import { ApiService } from './api.service';

const API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION;
const LOL_API_BASE_URL = 'api.riotgames.com/lol';

class LolService extends ApiService {
  async getRanked({
    region,
    queue,
    tier,
    division,
  }: {
    region?: string;
    queue: string;
    tier: string;
    division: string;
  }): Promise<any> {
    const url = `${
      region ?? DEFAULT_REGION
    }.${LOL_API_BASE_URL}/league-exp/v4/entries/${queue}/${tier}/${division}?api_key=${API_KEY}`;
    return await this.get({ url });
  }

  async getAccount({ region, name }: { region: string; name: string }): Promise<any> {
    const url = `${
      region ?? DEFAULT_REGION
    }.${LOL_API_BASE_URL}/summoner/v4/summoners/by-name/${name}/?api_key=${API_KEY}`;
    return await this.get({ url });
  }

  async getMatches(id: string, start?: number): Promise<any> {
    const matchIds = await this.get({
      url: `asia.${LOL_API_BASE_URL}/match/v5/matches/by-puuid/${id}/ids/?count=10&api_key=${API_KEY}`,
    });

    const matchPromises = matchIds.map((matchId: string) => {
      const matchUrl = `asia.${LOL_API_BASE_URL}/match/v5/matches/${matchId}/?api_key=${API_KEY}`;
      return this.get({ url: matchUrl });
    });

    const result = await Promise.all(matchPromises);
    return result;
  }
}

export const lolService = new LolService();
