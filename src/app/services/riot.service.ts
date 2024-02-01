import { HttpService } from './rest.data.service';

export class RiotService extends HttpService {
  private dragonApiVersion: string = '';

  async init() {
    if (this.dragonApiVersion) return;
    this.dragonApiVersion = await this.getLatestDragonApiVersion();
  }

  private async getLatestDragonApiVersion() {
    const result = await this.get({
      url: 'https://ddragon.leagueoflegends.com/api/versions.json',
    });

    return result[0];
  }

  getImageUrl(category: 'profileIcon' | 'champion' | 'item', name: string | number): string {
    const dragonImageUrl = `https://ddragon.leagueoflegends.com/cdn/${this.dragonApiVersion}/img`;
    const categoryMap: Record<string, string> = {
      profileIcon: 'profileicon',
      champion: 'champion',
      item: 'item',
    };
    const categoryPath = categoryMap[category];
    const imageSrc: string = `${dragonImageUrl}/${categoryPath}/${name}.png`;

    return imageSrc;
  }
}

export const riotService = new RiotService();
