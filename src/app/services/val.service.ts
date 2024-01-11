import { ApiService } from './api.service';

const API_KEY = process.env.NEXT_PUBLIC_VAL_API_KEY;
const REGION_URL = 'kr.api.riotgames.com';

class ValService extends ApiService {
  async getRanked(season: string, options?: { size?: number; startIndex?: number }): Promise<any> {
    return await this.get({
      url: `${REGION_URL}/val/ranked/v1/leaderboards/by-act/${season}?api_key=${API_KEY}`,
    });
  }

  async getStatus(): Promise<any> {
    return await this.get({
      url: `${REGION_URL}/val/status/v1/platform-data?api_key=${API_KEY}`,
    });
  }

  async getContents(): Promise<any> {
    return await this.get({
      url: `${REGION_URL}/val/content/v1/contents?api_key=${API_KEY}`,
    });
  }
}

export const valService = new ValService();
