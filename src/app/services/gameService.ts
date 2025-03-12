import { GameStats } from '@/app/(game)/shared/model/gameStats';
import { Match } from '../(game)/shared/model/match';
import { User } from '@/app/(game)/shared/model/user';

type findUserStatsOption = {
  region: string;
  user: User;
};

export abstract class GameService {
  abstract init(): Promise<void>;
  abstract findUser({ region, name }: { region: string; name: string }): Promise<User | undefined>;
  abstract getLeaderboard(findOption: any): Promise<GameStats[] | undefined>;
  abstract getUserStatistics(findOption: findUserStatsOption): Promise<GameStats[] | undefined>;
}
