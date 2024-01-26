import { Participant } from '../lol/models/interface';
import Image from 'next/image';
import { riotService } from '@/app/services/riot.service';

export default function TeamParticipants({ participants }: { participants: Participant[] }) {
  return (
    <div className="grid w-40 gap-1">
      {participants.map((participant) => {
        return (
          <div key={participant.puuid} className="flex w-28">
            <Image
              width={18}
              height={18}
              style={{ height: '18px' }}
              src={riotService.getImageUrl('champion', participant.championName)}
              alt="Image"
            />
            <p className="text-xs text-ellipsis overflow-hidden text-nowrap">{participant.riotIdGameName}</p>
          </div>
        );
      })}
    </div>
  );
}
