import _ from 'lodash';
import { regions } from '../(game)/shared/model/riot/regions';
import { RiotService } from './riot.service';
import { TFTStats } from '@/app/(game)/tft/model/stats';
import { LeagueList, Match } from '@/app/(game)/tft/model/interface';
import { Account, Summoner } from '@/app/(game)/shared/model/riot/interface';
import { TFTMatch } from '@/app/(game)/tft/model/match';
import { User } from '../(game)/shared/model/user';
import { httpService } from './httpService';
import { GameStats } from '../(game)/shared/model/gameStats';

const API_KEY = process.env.TFT_API_KEY;
const API_BASE_URL = 'api.riotgames.com/tft';

export class TFTService extends RiotService {
  getUserStatistics<T extends GameStats>(findOption: { region: string; user: User }): Promise<T[] | undefined> {
    throw new Error('Method not implemented.');
  }
  champions: Record<string, any> = {};

  constructor() {
    super();
  }

  async init() {
    this.apiVersion = '14.7.1';
    this.champions = await this.getChampions(this.apiVersion);
  }

  private async getChampions(apiVersion: string) {
    const result = await httpService.get<Record<string, any>>({
      url: `https://ddragon.leagueoflegends.com/cdn/${apiVersion}/data/ko_KR/tft-champion.json`,
    });

    return Object.values(result.data);
  }

  async getLeaderboard({ region, tier }: { region: string; tier: string }): Promise<any[]> {
    const url = `https://${region}.${API_BASE_URL}/league/v1/${tier}`;
    const result = await httpService.get<LeagueList>({ url, params: { queue: 'RANKED_TFT', api_key: API_KEY } });
    const data = result.entries.map((stats) => new TFTStats(stats));
    return data;
  }

  async findUser({ region, name }: { region: string; name: string }): Promise<User> {
    const continent = regions.find((item) => item.name === region)!.continent;
    const [summonerName, tag] = name.split('#');
    let userData: Summoner & Account;

    if (summonerName && tag) {
      const account = await this.getAccountByRiotId({ region: continent, name: summonerName, tag });
      const summoner = await httpService.get<Summoner>({
        url: `https://${region}.${API_BASE_URL}/summoner/v1/summoners/by-puuid/${account.puuid}`,
        params: { api_key: API_KEY },
      });

      userData = _.merge(account, summoner);
    } else if (summonerName) {
      const summoner = await httpService.get<Summoner>({
        url: `https://${region}.${API_BASE_URL}/summoner/v1/summoners/by-name/${summonerName}`,
        params: { api_key: API_KEY },
      });
      const account = await this.getAccountByPuuid(continent, summoner.puuid);

      userData = _.merge(account, summoner);
    } else {
      throw new Error('not Found Summoner');
    }

    if (!userData) return userData;

    const user = new User({
      name: userData.gameName,
      region: region,
      tag: userData.tagLine,
      id: userData.accountId,
      profileIcon: this.getImageUrl('profileIcon', userData.profileIconId),
      data: userData,
    });

    return user;
  }

  async getMatches({
    puuid,
    region,
    start = 0,
  }: {
    puuid: string;
    region: string;
    start?: number | string;
  }): Promise<TFTMatch[]> {
    const continent = regions.find((item) => item.name === region)!.continent;
    const matchIds = await httpService.get<string[]>({
      url: `https://${continent}.${API_BASE_URL}/match/v1/matches/by-puuid/${puuid}/ids`,
      params: { start, count: 5, api_key: API_KEY },
    });
    const matchPromises = matchIds.map((matchId: string) => {
      const matchUrl = `https://${continent}.${API_BASE_URL}/match/v1/matches/${matchId}`;
      return httpService.get<Match>({ url: matchUrl, params: { api_key: API_KEY } });
    });

    const result = await Promise.all(matchPromises);
    return result.map((item) => {
      item = {
        ...item,
        user: item.info.participants.find((participant) => participant.puuid === puuid)!,
      };

      return new TFTMatch(item);
    });
  }

  getImageUrl(category: 'profileIcon' | 'champion' | 'item', name: string | number, apiVersion?: string) {
    const dragonImageUrl = `https://ddragon.leagueoflegends.com/cdn/${apiVersion ?? this.apiVersion}/img`;
    const categoryMap: Record<string, string> = {
      profileIcon: 'profileicon',
      champion: 'tft-champion',
      item: 'tft-item',
    };

    const categoryPath = categoryMap[category];
    let imageSrc: string = `${dragonImageUrl}/${categoryPath}/${name}`;
    if (categoryPath === 'profileicon') imageSrc += '.png';
    return imageSrc;
  }
}

export const tftService = new TFTService();
