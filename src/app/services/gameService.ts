import { Dict } from '@/app/intrefaces/intreface';
import { lolService } from './lol.service';
import { tftService } from './tft.service';

export class GameService {
  currentService: GameService;

  private serviceMap: Dict = {
    lol: lolService,
    tft: tftService,
  };

  constructor(title: string) {
    this.currentService = this.serviceMap[title];
  }

  // async init() {
  //   await this.currentService.init?.();
  // }

  async findUser() {
    return;
  }
}
