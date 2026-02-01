import dayjs from 'dayjs';
import { secondsToMinutes } from '@/app/utils';
import { Match } from '../../model/match';

const MatchResult: React.FC<{ match: Match }> = ({ match }) => {
  const { creationTime, durationTime, mode, isWin, ranking } = match;
  const formattedDate = dayjs(creationTime).format('MM/DD');
  const { minutes, remainingSeconds } = secondsToMinutes(durationTime);

  return (
    <div className="flex flex-col items-center text-center">
      {/* 승패 or 순위 */}
      {ranking ? (
        <span className={`text-base sm:text-xl font-bold ${ranking <= 4 ? 'text-blue-500' : 'text-red-500'}`}>
          #{ranking}
        </span>
      ) : (
        <span className={`text-xs sm:text-sm font-bold ${isWin ? 'text-blue-500' : 'text-red-500'}`}>
          {isWin ? '승리' : '패배'}
        </span>
      )}

      {/* 게임 모드 */}
      <span className="text-[9px] sm:text-[11px] text-muted-foreground mt-0.5 sm:mt-1 truncate max-w-full">
        {mode}
      </span>

      {/* 시간 */}
      <span className="text-[9px] sm:text-[11px] text-muted-foreground">
        {minutes}:{remainingSeconds.toString().padStart(2, '0')}
      </span>

      {/* 날짜 */}
      <span className="text-[8px] sm:text-[10px] text-muted-foreground/70">
        {formattedDate}
      </span>
    </div>
  );
};

export default MatchResult;
