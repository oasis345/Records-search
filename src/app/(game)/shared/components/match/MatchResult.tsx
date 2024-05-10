import dayjs from 'dayjs';
import { secondsToMinutes } from '@/app/utils';
import { Match } from '../../model/match';

const MatchResult: React.FC<{ match: Match }> = ({ match }) => {
  const { creationTime, durationTime, mode, isWin } = match;
  const formattedGameCreationDate = dayjs(creationTime).format('MM월 DD일');
  const { minutes: durationMinutes, remainingSeconds: durationSeconds } = secondsToMinutes(durationTime);

  return (
    <div className="flex md:flex-col lg:flex-col md:w-32 lg:w-32 w-full items-center">
      <p className={`mx-1 font-bold ${isWin ? 'text-blue-500' : 'text-red-500'}`}>{isWin ? '승리' : '패배'}</p>
      <p className="mx-1 text-sm">{mode}</p>
      <p className="mx-1 text-xs">{`${durationMinutes}분 ${durationSeconds}초`}</p>
      <p className="mx-1 text-xs">{formattedGameCreationDate}</p>
    </div>
  );
};

export default MatchResult;
