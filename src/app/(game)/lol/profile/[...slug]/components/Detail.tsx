import { Match, Participant, ApiResource } from '../../../model/interface';
import MainContent from './MainConent';

const Detail: React.FC<{
  teamStats: { totalKills: number; totalAssists: number; totalDeaths: number };
  participants: Participant[];
  match: Match;
  resource: ApiResource;
}> = ({ teamStats, participants, match, resource }) => {
  const { totalKills, totalAssists, totalDeaths } = teamStats;

  return (
    <div className="w-full h-full p-x border">
      <div className="flex font-bold p-2">
        <p>팀 스코어</p> &nbsp;
        <p>{totalKills}</p> / <p className="text-red-500">{totalDeaths}</p> / <p>{totalAssists}</p>
      </div>
      <div className="border h-full">
        {participants.map((participant) => (
          <div key={participant.puuid} className="flex justify-between items-center border-b h-14">
            <MainContent participant={participant} isDetail={true} match={match} resource={resource} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;
