import { GameStats } from '../../model/gameStats';
import { Card, CardContent } from '@/components/ui/card';

const tierColors: Record<string, string> = {
  IRON: 'from-gray-400 to-gray-600',
  BRONZE: 'from-amber-600 to-amber-800',
  SILVER: 'from-slate-300 to-slate-500',
  GOLD: 'from-yellow-400 to-yellow-600',
  PLATINUM: 'from-cyan-400 to-cyan-600',
  EMERALD: 'from-emerald-400 to-emerald-600',
  DIAMOND: 'from-blue-400 to-purple-500',
  MASTER: 'from-purple-500 to-pink-500',
  GRANDMASTER: 'from-red-500 to-orange-500',
  CHALLENGER: 'from-amber-300 via-yellow-400 to-amber-500',
};

function StatsCard<T extends GameStats>({ mode, stats }: { mode: string; stats: T }) {
  const winRate = Math.floor((stats.wins / (stats.wins + stats.losses)) * 100);
  const totalGames = stats.wins + stats.losses;
  const tierGradient = tierColors[String(stats.tier || '').toUpperCase()] || 'from-gray-400 to-gray-600';

  return (
    <Card className="w-full border-none shadow-lg bg-gradient-to-br from-background to-muted/30 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          {/* Tier Badge */}
          <div className={`w-24 sm:w-28 bg-gradient-to-br ${tierGradient} flex flex-col items-center justify-center p-4`}>
            <span className="text-white font-bold text-sm drop-shadow-md">
              {stats.tier}
            </span>
            <span className="text-white/90 text-xs mt-1">
              {stats.data?.rank || 'I'}
            </span>
          </div>

          {/* Stats Content */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">{mode}</h3>
              <span className="text-lg font-bold text-primary">{stats.score} LP</span>
            </div>

            {/* Win Rate Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>승률</span>
                <span className={winRate >= 50 ? 'text-blue-500' : 'text-red-500'}>{winRate}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${winRate >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>

            {/* Win/Loss Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-blue-500 font-semibold">{stats.wins}W</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-red-500 font-semibold">{stats.losses}L</span>
              </div>
              <span className="text-muted-foreground text-xs">
                {totalGames} 게임
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatsCard;
