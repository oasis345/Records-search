import { GameStats } from '../(game)/shared/model/gameStats';
import { Match } from '../(game)/shared/model/match';
import { User } from '../(game)/shared/model/user';
import { FindUserOption, GameService } from './gameService';

export class GameServiceManager<T extends GameService = GameService> {
  services = new Map<string, any>();

  async registerService<S extends GameService>({
    serviceName,
    ServiceClass,
    args,
  }: {
    serviceName: string;
    ServiceClass: new (...args: any[]) => S;
    args?: any[];
  }) {
    if (!this.services.has(serviceName)) {
      const serviceInstance = new ServiceClass(args);
      await serviceInstance.init?.();
      this.services.set(serviceName, serviceInstance);
    }
  }

  getService<S>(serviceName: string): S {
    const service = this.services.get(serviceName);

    if (!service) {
      throw new Error(`${serviceName} is not supported.`);
    }

    return service;
  }

  // private prepare(): T {
  //   if (!this.currentService) throw new Error('Need to before registerService');

  //   return this.currentService;
  // }

  // async findUser(findUserOption: FindUserOption) {
  //   let user: User | undefined;
  //   try {
  //     const service = this.prepare();
  //     user = await service.findUser(findUserOption);
  //   } catch (error) {
  //     throw new Error('Not Found User');
  //   }

  //   return user;
  // }

  // async getLeaderBoard(option: any) {
  //   let stats: GameStats[] | undefined;
  //   try {
  //     const service = this.prepare();
  //     stats = await service.getLeaderBoard(option);
  //   } catch (error) {
  //     throw new Error('Not Found Match Data');
  //   }

  //   return stats;
  // }
}

//@ts-ignore
const instance = globalThis.gameServiceManager ?? new GameServiceManager();
export const gameServiceManager = instance as GameServiceManager;
