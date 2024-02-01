import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RiotService implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    private httpService: HttpService,
  ) {}
  public dragonApiVersion: string;

  async onModuleInit(): Promise<void> {
    try {
      const result = await this.httpService.get('https://ddragon.leagueoflegends.com/api/versions.json').toPromise();
      this.dragonApiVersion = result.data[0];
    } catch (error) {
      throw new Error('fail load dragonApiVersion');
    }
  }

  async getAccount({ region, name, tag }: { region: string; name: string; tag: string }): Promise<any> {
    try {
      const result = await this.httpService
        .get(
          `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}/?api_key=${this.config.get('LOL_API_KEY')}`,
        )
        .toPromise();
      return result.data;
    } catch (error) {
      throw new Error('User notFound');
    }
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
