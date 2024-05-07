import { GameStats } from '../../model/gameStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function StatsCard<T extends GameStats>({ mode, stats }: { mode: string; stats: T }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{mode}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <span>{`${stats.tier} ${stats.score}P`}</span>
          <span>{`승률: ${Math.floor((stats.wins / (stats.wins + stats.losses)) * 100)}% (승리: ${stats.wins} 패배: ${stats.losses})`}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatsCard;
