import { Match, Participant, ApiResource } from '../../../model/interface';
import MainContent from './MainConent';
import { Swords, Users } from 'lucide-react';

const Detail: React.FC<{
  teamStats: { totalKills: number; totalAssists: number; totalDeaths: number };
  participants: Participant[];
  match: Match;
  resource: ApiResource;
}> = ({ teamStats, participants, match, resource }) => {
  const { totalKills, totalAssists, totalDeaths } = teamStats;
  const isWinningTeam = participants[0]?.win;

  return (
    <div className="flex-1 min-w-0">
      {/* Team Header */}
      <div className={`
        flex items-center justify-between p-3 rounded-t-lg
        ${isWinningTeam ? 'bg-blue-500/10' : 'bg-red-500/10'}
      `}>
        <div className="flex items-center gap-2">
          <Users className={`w-4 h-4 ${isWinningTeam ? 'text-blue-500' : 'text-red-500'}`} />
          <span className={`font-semibold text-sm ${isWinningTeam ? 'text-blue-500' : 'text-red-500'}`}>
            {isWinningTeam ? '승리 팀' : '패배 팀'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-center gap-1 text-sm font-bold">
            <span className="text-foreground">{totalKills}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-red-500">{totalDeaths}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{totalAssists}</span>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="border border-border/50 rounded-b-lg overflow-hidden">
        {participants.map((participant, index) => (
          <div
            key={participant.puuid}
            className={`
              flex items-center p-2 sm:p-3
              ${index !== participants.length - 1 ? 'border-b border-border/50' : ''}
              ${participant.win ? 'bg-blue-500/5' : 'bg-red-500/5'}
              hover:bg-muted/30 transition-colors
            `}
          >
            <MainContent participant={participant} isDetail={true} match={match} resource={resource} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Detail;
