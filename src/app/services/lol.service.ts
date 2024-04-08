import { regions } from '@/app/(game)/lol/model/regions';
import { RiotService } from './riot.service';
import _ from 'lodash';
import { Match, Summoner } from '../(game)/lol/model/interface';

const API_KEY = process.env.LOL_API_KEY;
const API_BASE_URL = 'api.riotgames.com/lol';

class LOLService extends RiotService {
  spells: Record<string, any> = {};
  champions: Record<string, any> = {};

  constructor() {
    super();
  }

  async init() {
    await super.init();
    this.spells = await this.getSpells(this.dragonApiVersion);
    this.champions = await this.getChampions(this.dragonApiVersion);
  }

  private async getSpells(version: string) {
    const result = await this.get<Record<string, any>>({
      url: `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/summoner.json`,
    });

    return Object.values(result.data);
  }

  private async getChampions(version: string) {
    const result = await this.get<Record<string, any>>({
      url: `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`,
    });

    return Object.values(result.data);
  }

  async getRanked({ region, tier }: { region: string; tier: string }): Promise<any[]> {
    const url = `https://${region}.${API_BASE_URL}/league-exp/v4/entries/RANKED_SOLO_5x5/${tier}/I`;
    return await this.get({ url, params: { api_key: API_KEY } });
  }

  async getSummoner({ region, name }: { region: string; name: string }): Promise<Summoner> {
    const continent = regions.find((item) => item.name === region)!.continent;
    const [summonerName, tag] = name.split('#');
    let result: any = {};

    if (summonerName && tag) {
      const account = await this.getAccountByRiotId({ region: continent, name: summonerName, tag });
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
  }): Promise<Match[]> {
    const continent = regions.find((item) => item.name === region)!.continent;

    const matchIds = await this.get<string[]>({
      url: `https://${continent}.${API_BASE_URL}/match/v5/matches/by-puuid/${puuid}/ids`,
      params: { start, count: 20, api_key: API_KEY },
    });

    const matchPromises = matchIds.map((matchId: string) => {
      const matchUrl = `https://${continent}.${API_BASE_URL}/match/v5/matches/${matchId}`;
      return this.get({ url: matchUrl, params: { api_key: API_KEY } });
    });

    const result = await Promise.all(matchPromises);
    return result as Match[];
  }

  async getRotationChampions(): Promise<any[]> {
    const url = `https://kr.${API_BASE_URL}/platform/v3/champion-rotations`;
    return await this.get({ url, params: { api_key: API_KEY } });
  }

  getImageUrl(category: 'profileIcon' | 'champion' | 'item' | 'spell', name: string | number, apiVersion?: string) {
    const dragonImageUrl = `https://ddragon.leagueoflegends.com/cdn/${apiVersion ?? this.dragonApiVersion}/img`;
    const categoryMap: Record<string, string> = {
      profileIcon: 'profileicon',
      champion: 'champion',
      item: 'item',
      spell: 'spell',
    };

    const categoryPath = categoryMap[category];
    const imageSrc: string = `${dragonImageUrl}/${categoryPath}/${name}.png`;

    return imageSrc;
  }
}

export const lolService = new LOLService();
