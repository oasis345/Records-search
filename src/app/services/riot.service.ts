import RestDataService from './rest.data.service';

const API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION;

export class RiotService extends RestDataService {
  async getAccount({ region, name, tag }: { region: string; name: string; tag: string }): Promise<any> {
    return await this.get({
      url: `${
        region ?? DEFAULT_REGION
      }.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}/?api_key=${API_KEY}`,
    });
  }

  async getLatestDragonApiVersion() {
    const result = await this.get({
      url: 'ddragon.leagueoflegends.com/api/versions.json',
    });

    return result[0];
  }
}
