import { GameService } from './gameService';
import { registerServices as registerService } from './serviceRegister';

export class GameServiceManager<T extends GameService = GameService> {
  services = new Map<string, any>();

  async register<S extends GameService>({
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

  async getService<S>(serviceName: string): Promise<Awaited<S>> {
    const service = this.services.get(serviceName);

    if (!service) {
      await registerService(serviceName);
      return await this.getService(serviceName);
    }

    return service;
  }
}

const gameServiceManager = new GameServiceManager();
export default gameServiceManager;
