import { HttpService } from './httpService';

export class RiotService extends HttpService {
  private dragonApiVersion: string = '';
  spells: Record<string, any> = {};

  async init() {
    if (this.dragonApiVersion) return;
    this.dragonApiVersion = await this.getLatestDragonApiVersion();
    this.spells = await this.getSpells(this.dragonApiVersion);
  }

  private async getLatestDragonApiVersion() {
    const result = await this.get({
      url: 'https://ddragon.leagueoflegends.com/api/versions.json',
    });

    return result[0];
  }

  private async getSpells(version: string) {
    const result = await this.get({
      url: `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/summoner.json`,
    });

    return Object.values(result.data);
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
