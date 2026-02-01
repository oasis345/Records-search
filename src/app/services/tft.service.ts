import _ from 'lodash';
import { regions } from '../(game)/shared/model/riot/regions';
import { RiotService } from './riot.service';
import { TFTStats } from '@/app/(game)/tft/model/stats';
import { LeagueItem, LeagueList, Match } from '@/app/(game)/tft/model/interface';
import { Account, RiotUser, Summoner } from '@/app/(game)/shared/model/riot/interface';
import { TFTMatch } from '@/app/(game)/tft/model/match';
import { User } from '../(game)/shared/model/user';
import { httpService } from './httpService';

const API_KEY = process.env.TFT_API_KEY;
const API_BASE_URL = 'api.riotgames.com/tft';

export class TFTService extends RiotService {
  champions: any[] = [];
  augments: any[] = [];
  traits: any[] = [];
  items: any[] = [];

  constructor() {
    super();
  }

  protected getApiKey(): string | undefined {
    return API_KEY;
  }

  async init() {
    await super.init();

    try {
      const [champions, augments, traits, items] = await Promise.all([
        this.getChampions(this.apiVersion),
        this.getAugments(this.apiVersion),
        this.getTraits(this.apiVersion),
        this.getItems(this.apiVersion),
      ]);
      this.champions = champions;
      this.augments = augments;
      this.traits = traits;
      this.items = items;
    } catch (error) {
      console.error('Failed to load TFT data:', error);
      this.champions = [];
      this.augments = [];
      this.traits = [];
      this.items = [];
    }
  }

  private async getChampions(apiVersion: string) {
    try {
      const result = await httpService.get<Record<string, any>>({
        url: `https://ddragon.leagueoflegends.com/cdn/${apiVersion}/data/ko_KR/tft-champion.json`,
        revalidate: 'weekend',
      });
      return Object.values(result.data);
    } catch {
      return [];
    }
  }

  private async getAugments(apiVersion: string) {
    try {
      const result = await httpService.get<Record<string, any>>({
        url: `https://ddragon.leagueoflegends.com/cdn/${apiVersion}/data/ko_KR/tft-augments.json`,
        revalidate: 'weekend',
      });
      return Object.values(result.data);
    } catch {
      return [];
    }
  }

  private async getTraits(apiVersion: string) {
    try {
      const result = await httpService.get<Record<string, any>>({
        url: `https://ddragon.leagueoflegends.com/cdn/${apiVersion}/data/ko_KR/tft-trait.json`,
        revalidate: 'weekend',
      });
      return Object.values(result.data);
    } catch {
      return [];
    }
  }

  private async getItems(apiVersion: string) {
    try {
      const result = await httpService.get<Record<string, any>>({
        url: `https://ddragon.leagueoflegends.com/cdn/${apiVersion}/data/ko_KR/tft-item.json`,
        revalidate: 'weekend',
      });
      return Object.values(result.data);
    } catch {
      return [];
    }
  }

  async getLeaderboard({ region, tier }: { region: string; tier: string }): Promise<TFTStats[]> {
    let result: LeagueList;

    try {
      const url = `https://${region}.${API_BASE_URL}/league/v1/${tier}`;
      result = await httpService.get<LeagueList>({
        url,
        params: { api_key: API_KEY },
        revalidate: 'hour',
      });
    } catch (error) {
      console.error('Failed to fetch TFT leaderboard:', error);
      return [];
    }

    if (!result?.entries || result.entries.length === 0) {
      return [];
    }

    // LP 기준 정렬 후 상위 50명 (Vercel Free Tier 10초 타임아웃 고려)
    const sortedEntries = result.entries
      .sort((a, b) => (b.leaguePoints || 0) - (a.leaguePoints || 0))
      .slice(0, 50);

    // 유저 정보 배치 조회 (10명씩 나눠서 처리)
    const BATCH_SIZE = 10;
    const users: RiotUser[] = [];

    for (let i = 0; i < sortedEntries.length; i += BATCH_SIZE) {
      const batch = sortedEntries.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((stats) => this.getUserByPuuid(region, stats.puuid))
      );

      const batchUsers = batchResults
        .filter((item): item is PromiseFulfilledResult<RiotUser> => item.status === 'fulfilled')
        .map((item) => item.value);

      users.push(...batchUsers);
    }

    const statistics = sortedEntries.map((stats) => {
      const foundUser = users.find((item: RiotUser) => item.puuid === stats.puuid);
      stats.tier = result.tier;
      return this.createStats({ stats, user: foundUser! });
    });

    return statistics.filter((stat) => stat.user);
  }

  createStats({ stats, user }: { stats: LeagueItem; user: RiotUser }) {
    const lolStats = _.toPlainObject(new TFTStats(stats, user));
    return lolStats;
  }

  async getUserStatistics<TFTStats>({ region, user }: { region: string; user: User }): Promise<TFTStats[]> {
    try {
      const result = await httpService.get<LeagueItem[]>({
        url: `https://${region}.${API_BASE_URL}/league/v1/entries/by-summoner/${user.id}`,
        params: { api_key: API_KEY },
      });

      const statistics = result.map((stats) => {
        return this.createStats({ stats, user: user.data });
      });

      // @ts-ignore
      return statistics;
    } catch (error) {
      console.error('Failed to fetch user statistics:', error);
      // @ts-ignore
      return [];
    }
  }

  async getUserBySummonerId(region: string, id: string): Promise<RiotUser> {
    const url = `https://${region}.${API_BASE_URL}/summoner/v1/summoners/${id}`;
    const continent = regions.find((item) => item.name === region)!.continent;
    const summoner = await httpService.get<Summoner>({ url, params: { api_key: API_KEY } });
    const account = await this.getAccountByPuuid(continent, summoner.puuid);
    return _.merge(account, summoner);
  }

  async getUserByPuuid(region: string, id: string): Promise<RiotUser> {
    const url = `https://${region}.${API_BASE_URL}/summoner/v1/summoners/by-puuid/${id}`;
    const continent = regions.find((item) => item.name === region)!.continent;
    const summoner = await httpService.get<Summoner>({ url, params: { api_key: API_KEY } });
    const account = await this.getAccountByPuuid(continent, summoner.puuid);
    return _.merge(account, summoner);
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
      id: userData.id,
      profileIcon: this.getImageUrl('profileIcon', userData.profileIconId),
      data: userData,
    });

    return _.toPlainObject(user);
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

    // for (const match of result) {
    //   const ids = match.metadata.participants.map((participantId) => participantId);
    //   const userPromises = ids.map((id) => this.getUserByPuuid(region, id));
    //   const users = await Promise.all(userPromises);
    //   match.info.participants = match.info.participants.map((participant) => {
    //     return {
    //       ...participant,
    //       user: users.find((item) => item.puuid === participant.puuid),
    //     };
    //   });
    // }

    return result.map((item) => {
      item = {
        ...item,
        user: item.info.participants.find((participant) => participant.puuid === puuid)!,
      };

      return _.toPlainObject(new TFTMatch(item));
    });
  }

  getImageUrl(
    category: 'profileIcon' | 'champion' | 'item' | 'augment' | 'trait' | 'sprite',
    name: string | number,
    apiVersion?: string,
  ) {
    const dragonImageUrl = `https://ddragon.leagueoflegends.com/cdn/${apiVersion ?? this.apiVersion}/img`;
    const categoryMap: Record<string, string> = {
      profileIcon: 'profileicon',
      champion: 'tft-champion',
      item: 'tft-item',
      augment: 'tft-augment',
      trait: 'tft-trait',
      sprite: 'sprite',
    };

    const categoryPath = categoryMap[category];
    let imageSrc: string = `${dragonImageUrl}/${categoryPath}/${name}`;
    if (!imageSrc.includes('.png')) imageSrc += '.png';

    return imageSrc;
  }
}

export const tftService = new TFTService();
