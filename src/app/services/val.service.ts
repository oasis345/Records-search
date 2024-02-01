// import { ApiService } from './api.service';

// const API_KEY = '';
// const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION;

// class ValService extends ApiService {
//   async getRanked(options: { season: string; region?: string; size?: number; startIndex?: number }): Promise<any> {
//     return await this.get({
//       url: `${options?.region ?? DEFAULT_REGION}.api.riotgames.com/val/ranked/v1/leaderboards/by-act/${
//         options.season
//       }?size=${options?.size ?? 200}&startIndex=${options?.startIndex ?? 0}&api_key=${API_KEY}`,
//     });
//   }

//   async getContents(): Promise<any> {
//     return await this.get({
//       url: `kr.api.riotgames.com/val/content/v1/contents?api_key=${API_KEY}`,
//     });
//   }
// }

// export const valService = new ValService();
