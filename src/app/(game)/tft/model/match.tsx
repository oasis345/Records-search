import { ReactNode } from 'react';
import { Match, MatchHistoryItemBuilder } from '../../shared/model/match';
import { Match as TFTMatchInterface } from './interface';
import { tftService } from '@/app/services/tft.service';
import Image from 'next/image';

export class TFTMatchHistoryItemBuilder extends MatchHistoryItemBuilder<TFTMatch> {
  getContents(data: TFTMatchInterface): ReactNode {
    const { user } = data;

    return (
      <div className="flex w-full h-full gap-2 items-center ">
        {user.units.map((unit) => {
          const url = tftService.getImageUrl(
            'champion',
            this.resource.champions.find((champion: Record<string, any>) => champion.id === unit.character_id)?.image
              ?.full,
            this.resource.apiVersion,
          );
          return (
            <div key={Math.random()} className="relative w-12 h-12">
              <Image fill src={url} alt="character" objectPosition="right" objectFit="cover" />
            </div>
          );
        })}
      </div>
    );
  }
}

export class TFTMatch extends Match {
  constructor(match: TFTMatchInterface) {
    const { metadata, info } = match;

    super({
      creationTime: info.game_datetime,
      durationTime: info.game_length,
      id: metadata.match_id,
      participants: info.participants.map((participant) => ({ name: participant.puuid })),
      mode: info.tft_game_type,
      data: match,
    });
  }
}
