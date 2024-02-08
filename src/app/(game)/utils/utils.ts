import { LoLStats } from '../lol/model/stats';
import { TFTStats } from '../tft/model/stats';
import { Game } from '../model/model';

export function gameStatsToModel<T>(data: any, type: Game) {
  switch (type) {
    case 'lol':
      return new LoLStats(data) as T;

    case 'tft':
      return new TFTStats(data) as T;
  }
}
