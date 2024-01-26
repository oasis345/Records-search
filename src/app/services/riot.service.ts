import RestDataService from './rest.data.service';

export class RiotService extends RestDataService {
  private dragonApiVersion: string = '';

  async init() {
    if (this.dragonApiVersion) return;
    this.dragonApiVersion = await this.getLatestDragonApiVersion();
  }

  // async getAccount({ region, name, tag }: { region: string; name: string; tag: string }): Promise<any> {
  //   return await this.get({
  //     url: `${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}/?api_key=${API_KEY}`,
  //   });
  // }

  private async getLatestDragonApiVersion() {
    const result = await this.get({
      url: 'ddragon.leagueoflegends.com/api/versions.json',
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
