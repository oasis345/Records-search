import { HttpService } from './httpService';
const API_KEY = process.env.LOL_API_KEY;

export class RiotService extends HttpService {
  private dragonApiVersion: string = '';
  spells: Record<string, any> = {};
  champions: Record<string, any> = {};

  async init() {
    if (this.dragonApiVersion) return;
    this.dragonApiVersion = await this.getLatestDragonApiVersion();
    this.spells = await this.getSpells(this.dragonApiVersion);
    this.champions = await this.getChampions(this.dragonApiVersion);
  }

  private async getLatestDragonApiVersion() {
    const result = await this.get<any[]>({
      url: 'https://ddragon.leagueoflegends.com/api/versions.json',
    });

    return result[0];
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

  async getAccountByRiotId({
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

  async getAccountByPuuid(region: string, puuid: string): Promise<Record<string, any>> {
    const result = await this.get<Record<string, any>>({
      url: `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`,
      params: { api_key: API_KEY },
    });

    return result;
  }

  getImageUrl(category: 'profileIcon' | 'champion' | 'item' | 'spell', name: string | number): string {
    const dragonImageUrl = `https://ddragon.leagueoflegends.com/cdn/${this.dragonApiVersion}/img`;
    const categoryMap: Record<string, string> = {
      profileIcon: 'profileicon',
      champion: 'champion',
      item: 'item',
      spell: 'spell',
    };

    if (category === 'spell') name = this.spells.find((spell: any) => spell.key === String(name)).id;
    const categoryPath = categoryMap[category];
    const imageSrc: string = `${dragonImageUrl}/${categoryPath}/${name}.png`;

    return imageSrc;
  }
}

export const riotService = new RiotService();
