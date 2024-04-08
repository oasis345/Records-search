import _ from 'lodash';
import { regions } from '../(game)/lol/model/regions';
import { RiotService } from './riot.service';

const API_KEY = process.env.TFT_API_KEY;
const API_BASE_URL = 'api.riotgames.com/tft';

class TFTService extends RiotService {
  champions: Record<string, any> = {};

  constructor() {
    super();
  }

  async init() {
    this.dragonApiVersion = '13.24.1';
    this.champions = await this.getChampions(this.dragonApiVersion);
  }

  private async getChampions(version: string) {
    const result = await this.get<Record<string, any>>({
      url: `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/tft-champion.json`,
    });

    return Object.values(result.data);
  }

  async getRanked({ region, tier }: { region: string; tier: string }): Promise<any[]> {
    const url = `https://${region}.${API_BASE_URL}/league/v1/challenger`;
    const result = await this.get<Record<string, any>>({ url, params: { queue: 'RANKED_TFT', api_key: API_KEY } });

    return result.entries;
  }

  async getSummoner({ region, name }: { region: string; name: string }): Promise<any> {
    const continent = regions.find((item) => item.name === region)!.continent;
    const [summonerName, tag] = name.split('#');
    let result: any = {};

    if (summonerName && tag) {
      const account = await this.getAccountByRiotId({ region: continent, name: summonerName, tag });
      const summoner = await this.get<Record<string, any>>({
        url: `https://${region}.${API_BASE_URL}/summoner/v1/summoners/by-puuid/${account.puuid}`,
        params: { api_key: API_KEY },
      });

      result = _.merge(account, summoner);
    } else if (summonerName) {
      const summoner = await this.get<Record<string, any>>({
        url: `https://${region}.${API_BASE_URL}/summoner/v1/summoners/by-name/${summonerName}`,
        params: { api_key: API_KEY },
      });
      const account = await this.getAccountByPuuid(continent, summoner.puuid);

      result = _.merge(account, summoner);
    }

    return result;
  }

  async getMatches({
    puuid,
    region,
    start = 0,
  }: {
    puuid: string;
    region: string;
    start?: number | string;
  }): Promise<any> {
    const continent = regions.find((item) => item.name === region)!.continent;

    const matchIds = await this.get<string[]>({
      url: `https://${continent}.${API_BASE_URL}/match/v1/matches/by-puuid/${puuid}/ids`,
      params: { start, count: 5, api_key: API_KEY },
    });

    const matchPromises = matchIds.map((matchId: string) => {
      const matchUrl = `https://${continent}.${API_BASE_URL}/match/v1/matches/${matchId}`;
      return this.get({ url: matchUrl, params: { api_key: API_KEY } });
    });

    const result = await Promise.all(matchPromises);

    return result;
  }

  getImageUrl(category: 'profileIcon' | 'champion' | 'item', name: string | number, apiVersion?: string) {
    const dragonImageUrl = `https://ddragon.leagueoflegends.com/cdn/${apiVersion ?? this.dragonApiVersion}/img`;
    const categoryMap: Record<string, string> = {
      profileIcon: 'profileicon',
      champion: 'tft-champion',
      item: 'tft-item',
    };

    const categoryPath = categoryMap[category];
    const imageSrc: string = `${dragonImageUrl}/${categoryPath}/${name}`;

    return imageSrc;
  }
}

export const tftService = new TFTService();
