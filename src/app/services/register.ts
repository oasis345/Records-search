import { gameServiceManager } from '@/app/services/serviceManager';
import { LOLService } from '@/app/services/lol.service';
import { PubgService } from '@/app/services/pubg.service';
import { TFTService } from '@/app/services/tft.service';

export async function register() {
  await gameServiceManager.registerService({ serviceName: 'lol', ServiceClass: LOLService });
  await gameServiceManager.registerService({ serviceName: 'tft', ServiceClass: TFTService });
  await gameServiceManager.registerService({ serviceName: 'pubg', ServiceClass: PubgService });
  // @ts-ignore
  globalThis.gameServiceManager = gameServiceManager;
}
