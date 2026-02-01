import { regions } from '@/app/(game)/shared/model/riot/regions';
import { RiotService } from './riot.service';
import _ from 'lodash';
import { LeagueEntry, LeagueList, Match } from '../(game)/lol/model/interface';
import { RiotUser, Summoner } from '@/app/(game)/shared/model/riot/interface';
import { LOLMatch } from '../(game)/lol/model/match';
import { User } from '../(game)/shared/model/user';
import { httpService } from './httpService';
import { LoLStats } from '@lol/model/stats';
import * as cheerio from 'cheerio';

const API_KEY = process.env.LOL_API_KEY;
const API_BASE_URL = 'api.riotgames.com/lol';

// 상위 티어 (별도 엔드포인트 사용)
const APEX_TIERS = ['challenger', 'grandmaster', 'master'];

export class LOLService extends RiotService {
  spells: Record<string, any> = {};
  champions: Record<string, any> = {};

  constructor() {
    super();
  }

  protected getApiKey(): string | undefined {
    return API_KEY;
  }

  async init() {
    await super.init();
    const [spells, champions] = await Promise.all([
      this.getSpells(this.apiVersion),
      this.getChampions(this.apiVersion),
    ]);
    this.spells = spells;
    this.champions = champions;
  }

  async getSpells(version: string) {
    const result = await httpService.get<Record<string, any>>({
      url: `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/summoner.json`,
      revalidate: 'weekend',
    });

    return Object.values(result.data);
  }

  async getChampions(version: string) {
    const result = await httpService.get<Record<string, any>>({
      url: `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`,
      revalidate: 'weekend',
    });

    return Object.values(result.data);
  }

  async getLeaderboard({
    region,
    tier,
    page = 1,
  }: {
    region: string;
    tier: string;
    page?: number;
  }): Promise<LoLStats[]> {
    const tierLower = tier.toLowerCase();
    let entries: LeagueEntry[] = [];

    try {
      if (APEX_TIERS.includes(tierLower)) {
        // 상위 티어: /league/v4/{tier}/by-queue/{queue}
        const url = `https://${region}.${API_BASE_URL}/league/v4/${tierLower}leagues/by-queue/RANKED_SOLO_5x5`;
        const result = await httpService.get<LeagueList>({
          url,
          params: { api_key: API_KEY },
          revalidate: 'hour',
        });
        entries = result.entries.map((entry) => ({
          ...entry,
          tier: result.tier,
          rank: 'I',
          queueType: 'RANKED_SOLO_5x5',
        }));
      } else {
        // 하위 티어: /league-exp/v4/entries/{queue}/{tier}/{division}
        const url = `https://${region}.${API_BASE_URL}/league-exp/v4/entries/RANKED_SOLO_5x5/${tier.toUpperCase()}/I`;
        entries = await httpService.get<LeagueEntry[]>({
          url,
          params: { page, api_key: API_KEY },
          revalidate: 'hour',
        });
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard entries:', error);
      return [];
    }

    if (!entries || entries.length === 0) {
      return [];
    }

    // LP 기준 정렬 후 상위 50명 (Vercel Free Tier 10초 타임아웃 고려)
    const sortedEntries = entries
      .sort((a, b) => (b.leaguePoints || 0) - (a.leaguePoints || 0))
      .slice(0, 50);

    // 유저 정보 배치 조회 (10명씩 나눠서 처리)
    const continent = regions.find((item) => item.name === region)?.continent;
    if (!continent) {
      console.error('Invalid region:', region);
      return [];
    }

    const BATCH_SIZE = 10;
    const users: RiotUser[] = [];

    for (let i = 0; i < sortedEntries.length; i += BATCH_SIZE) {
      const batch = sortedEntries.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((stats) => this.getUserByPuuid(region, continent, stats.puuid))
      );

      const batchUsers = batchResults
        .filter((result): result is PromiseFulfilledResult<RiotUser> => result.status === 'fulfilled')
        .map((result) => result.value);

      users.push(...batchUsers);
    }

    const statistics = sortedEntries.map((stats) => {
      const foundUser = users.find((item: RiotUser) => item.puuid === stats.puuid);
      return this.createStats({ stats, user: foundUser! });
    });

    return statistics.filter((stat) => stat.user);
  }

  createStats({ stats, user }: { stats: LeagueEntry; user: RiotUser }): LoLStats {
    const lolStats = _.toPlainObject(new LoLStats(stats, user));
    return lolStats;
  }

  async getUserStatistics({ region, user }: { region: string; user: User }): Promise<LoLStats[] | undefined> {
    try {
      const url = `https://${region}.${API_BASE_URL}/league/v4/entries/by-summoner/${user.id}`;
      const result = await httpService.get<LeagueEntry[]>({ url, params: { api_key: API_KEY } });
      const statistics = result.map((stats) => {
        return this.createStats({ stats, user: user.data });
      });
      return statistics;
    } catch (error) {
      console.error('Failed to fetch user statistics:', error);
      return [];
    }
  }

  async getUserBySummonerId(region: string, id: string): Promise<RiotUser> {
    const url = `https://${region}.${API_BASE_URL}/summoner/v4/summoners/${id}`;
    const continent = regions.find((item) => item.name === region)!.continent;
    const summoner = await httpService.get<Summoner>({ url, params: { api_key: API_KEY } });
    const account = await this.getAccountByPuuid(continent, summoner.puuid);
    return _.merge(account, summoner);
  }

  async getUserByPuuid(region: string, continent: string, puuid: string): Promise<RiotUser> {
    const summonerUrl = `https://${region}.${API_BASE_URL}/summoner/v4/summoners/by-puuid/${puuid}`;
    const summoner = await httpService.get<Summoner>({ url: summonerUrl, params: { api_key: API_KEY } });
    const account = await this.getAccountByPuuid(continent, puuid);
    return _.merge(account, summoner);
  }

  async findUser({ region, name }: { region: string; name: string }) {
    const continent = regions.find((item) => item.name === region)!.continent;
    const [summonerName, tag] = name.split('#');
    let userData: RiotUser | undefined;

    if (summonerName && tag) {
      const account = await this.getAccountByRiotId({ region: continent, name: summonerName, tag });
      const summoner = await httpService.get<Summoner>({
        url: `https://${region}.${API_BASE_URL}/summoner/v4/summoners/by-puuid/${account.puuid}`,
        params: { api_key: API_KEY },
      });

      userData = _.merge(account, summoner);
    } else if (summonerName) {
      const summoner = await httpService.get<Summoner>({
        url: `https://${region}.${API_BASE_URL}/summoner/v4/summoners/by-name/${summonerName}`,
        params: { api_key: API_KEY },
      });
      const account = await this.getAccountByPuuid(continent, summoner.puuid);

      userData = _.merge(account, summoner);
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
  }): Promise<LOLMatch[]> {
    const continent = regions.find((item) => item.name === region)!.continent;
    const matchIds = await httpService.get<string[]>({
      url: `https://${continent}.${API_BASE_URL}/match/v5/matches/by-puuid/${puuid}/ids`,
      params: { start, count: 10, api_key: API_KEY },
    });
    const matchPromises = matchIds.map((matchId: string) => {
      const matchUrl = `https://${continent}.${API_BASE_URL}/match/v5/matches/${matchId}`;
      return httpService.get<Match>({ url: matchUrl, params: { api_key: API_KEY } });
    });
    const result = await Promise.all(matchPromises);

    return result.map((item) => {
      item = {
        ...item,
        user: item.info.participants.find((participant) => participant.puuid === puuid)!,
      };

      return _.toPlainObject(new LOLMatch(item));
    });
  }

  async getRotationChampions(): Promise<Record<string, any>> {
    const url = `https://kr.${API_BASE_URL}/platform/v3/champion-rotations`;
    return await httpService.get({ url, params: { api_key: API_KEY }, revalidate: 'day' });
  }

  async patchNotes() {
    const url = 'https://www.leagueoflegends.com/ko-kr/news/tags/patch-notes';
    const response = await httpService.get({ url, revalidate: 'day' });
    const $ = cheerio.load(response);

    const patchNotes = $('a')
      .map((_, el) => {
        return {
          title: $(el).attr('aria-label'),
          link: $(el).attr('href'),
        };
      })
      .get();

    return patchNotes;
  }

  getImageUrl(category: 'profileIcon' | 'champion' | 'item' | 'spell', name: string | number, apiVersion?: string) {
    const dragonImageUrl = `https://ddragon.leagueoflegends.com/cdn/${apiVersion ?? this.apiVersion}/img`;
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
