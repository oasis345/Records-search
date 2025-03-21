import { regions } from '@/app/(game)/shared/model/riot/regions';
import { RiotService } from './riot.service';
import _ from 'lodash';
import { LeagueEntry, Match } from '../(game)/lol/model/interface';
import { RiotUser, Summoner } from '@/app/(game)/shared/model/riot/interface';
import { LOLMatch } from '../(game)/lol/model/match';
import { User } from '../(game)/shared/model/user';
import { httpService } from './httpService';
import { LoLStats } from '@lol/model/stats';
import * as cheerio from 'cheerio';

const API_KEY = process.env.LOL_API_KEY;
const API_BASE_URL = 'api.riotgames.com/lol';

export class LOLService extends RiotService {
  spells: Record<string, any> = {};
  champions: Record<string, any> = {};

  constructor() {
    super();
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
    });

    return Object.values(result.data);
  }

  async getChampions(version: string) {
    const result = await httpService.get<Record<string, any>>({
      url: `https://ddragon.leagueoflegends.com/cdn/${version}/data/ko_KR/champion.json`,
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
    const url = `https://${region}.${API_BASE_URL}/league-exp/v4/entries/RANKED_SOLO_5x5/${tier.toUpperCase()}/I`;
    const result = await httpService.get<LeagueEntry[]>({
      url,
      params: { page: 1, api_key: API_KEY },
      revalidate: 'day',
    });
    const summonerIds = result.map((stats) => stats.summonerId).slice(0, 10);
    const userPromises = summonerIds.map((id) => this.getUserBySummonerId(region, id));
    const user = await Promise.all<RiotUser>(userPromises);
    const statistics = result.map((stats) => {
      const foundUser = user.find((item: RiotUser) => item.id === stats.summonerId)!;
      return this.createStats({ stats, user: foundUser });
    });

    return statistics;
  }

  createStats({ stats, user }: { stats: LeagueEntry; user: RiotUser }): LoLStats {
    const lolStats = _.toPlainObject(new LoLStats(stats, user));
    return lolStats;
  }

  async getUserStatistics({ region, user }: { region: string; user: User }): Promise<LoLStats[] | undefined> {
    const url = `https://${region}.${API_BASE_URL}/league/v4/entries/by-summoner/${user.id}`;
    const result = await httpService.get<LeagueEntry[]>({ url, params: { api_key: API_KEY } });
    const statistics = result.map((stats) => {
      return this.createStats({ stats, user: user.data });
    });

    return statistics;
  }

  async getUserBySummonerId(region: string, id: string): Promise<RiotUser> {
    const url = `https://${region}.${API_BASE_URL}/summoner/v4/summoners/${id}`;
    const continent = regions.find((item) => item.name === region)!.continent;
    const summoner = await httpService.get<Summoner>({ url, params: { api_key: API_KEY } });
    const account = await this.getAccountByPuuid(continent, summoner.puuid);
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
