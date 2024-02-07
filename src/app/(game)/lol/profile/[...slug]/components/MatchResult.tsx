import dayjs from 'dayjs';
import { gameModes } from '../../../model/gameModes';
import { Match, Participant } from '../../../model/interface';
import { secondsToMinutes } from '@/app/utils';

const MatchResult: React.FC<{ match: Match; participant: Participant }> = ({ match, participant }) => {
  const { info } = match;
  const { win } = participant;
  const gameModeLabel = gameModes.find((mode) => mode.key === info.gameMode)?.label;
  const formattedGameCreationDate = dayjs(info.gameCreation).format('MM월 DD일');
  const { minutes: durationMinutes, remainingSeconds: durationSeconds } = secondsToMinutes(info.gameDuration);

  return (
    <div className="flex md:flex-col lg:flex-col md:w-32 lg:w-32 w-full items-center">
      <p className={`mx-1 font-bold ${win ? 'text-blue-500' : 'text-red-500'}`}>{win ? '승리' : '패배'}</p>
      <p className="mx-1 text-sm">{gameModeLabel ?? info.gameMode}</p>
      <p className="mx-1 text-xs">{`${durationMinutes}분 ${durationSeconds}초`}</p>
      <p className="mx-1 text-xs">{formattedGameCreationDate}</p>
    </div>
  );
};

export default MatchResult;
