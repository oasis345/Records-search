import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LolService {
  constructor(
    private readonly config: ConfigService,
    private httpService: HttpService,
  ) {}

  async getSummoner({ region, name }: { region: string; name: string }) {
    try {
      const result = await this.httpService
        .get(
          `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}/?api_key=${this.config.get('LOL_API_KEY')}`,
        )
        .toPromise();
      return result.data;
    } catch (error) {
      throw new Error('Summoner notFound');
    }
  }

  async getMatches({ puuid, region, start, count }: { puuid: string; region: string; start?: number; count?: number }) {
    try {
      const matchIds = await this.httpService
        .get(
          `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count ?? 6}&api_key=${this.config.get('LOL_API_KEY')}`,
        )
        .toPromise();

      const matchPromises = matchIds.data.map(async (matchId: string) => {
        const matchUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}/?api_key=${this.config.get('LOL_API_KEY')}`;
        return await this.httpService.get(matchUrl).toPromise();
      });

      const matches = (await Promise.all(matchPromises)).map((promise) => promise.data);
      return matches;
    } catch (error) {
      throw new Error('fail get matches');
    }
  }

  async getLeaderBoard({
    region,
    queue,
    tier,
    division,
  }: {
    region?: string;
    queue: string;
    tier: string;
    division: string;
  }) {
    const result = await this.httpService
      .get(
        `https://${region}.api.riotgames.com/lol/league-exp/v4/entries/${queue}/${tier}/${division}?api_key=${this.config.get('LOL_API_KEY')}`,
      )
      .toPromise();
    return result.data;
  }
}
