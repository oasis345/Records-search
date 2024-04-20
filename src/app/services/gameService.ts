import { GameStats } from '../(game)/shared/model/gameStats';
import { Match } from '../(game)/shared/model/match';
import { User } from '../(game)/shared/model/user';

export interface FindUserOption {
  region: string;
  name: string;
}

export abstract class GameService {
  abstract init(): Promise<void>;
  abstract findUser(findUserOption: FindUserOption): Promise<User | undefined>;
  abstract getLeaderBoard(findOption: any): Promise<GameStats[] | undefined>;
}
