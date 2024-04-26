import gameServiceManager from '@/app/services/serviceManager';
import { LOLService } from '@/app/services/lol.service';
import { PubgService } from '@/app/services/pubg.service';
import { TFTService } from '@/app/services/tft.service';

export async function registerServices(serviceName: string) {
  const serviceMap: Record<string, any> = {
    'lol': LOLService,
    'tft': TFTService,
    'pubg': PubgService
  }

  const service = serviceMap[serviceName]
  await gameServiceManager.register({ serviceName, ServiceClass: service });
}
