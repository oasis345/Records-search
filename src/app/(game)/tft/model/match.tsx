import { ReactNode } from 'react';
import { Match, MatchHistoryItemBuilder } from '../../shared/model/match';
import { Match as TFTMatchInterface } from './interface';
import { tftService } from '@/app/services/tft.service';
import Image from 'next/image';
import { gameModes } from './gameModes';
import { List } from '@/app/components/list/List';
import { Star as StarIcon } from 'lucide-react';
import { BLUR_IMAGE_PATH } from '@/app/utils';

const MIN_TIER_THRESHOLD = 1;

export class TFTMatchHistoryItemBuilder extends MatchHistoryItemBuilder<TFTMatch> {
  getContents(data: TFTMatchInterface): ReactNode {
    const { user } = data;
    const apiVersion = this.resource.apiVersion;
    const traitsMap = user.traits
      .filter((item) => item.tier_current >= MIN_TIER_THRESHOLD)
      .map((userTrait) => {
        const trait = this.resource.traits.find((trait: Record<string, any>) => trait.id === userTrait.name);
        const { image } = trait;
        const url = tftService.getImageUrl('trait', image.full, apiVersion);

        return (
          <div key={trait.name} className="flex gap-1 items-center">
            <Image className="w-4 md:w-6" width={image.w} height={image.h} src={url} alt="trait" />
            <span className="hidden xl:block">{trait.name}</span>
            <span>{userTrait.num_units}</span>
          </div>
        );
      })
      .filter(Boolean);

    const unitsMap = user.units
      .map((unit) => {
        const champion = this.resource.champions.find(
          (champ: Record<string, any>) => champ.id.toLowerCase() === unit.character_id.toLowerCase(),
        );
        if (!champion) return null;

        const { image: championImg } = champion;
        const championUrl = tftService.getImageUrl('sprite', champion.image?.sprite, apiVersion);
        const itemUrls = unit.itemNames.map((itemName) => tftService.getImageUrl('item', itemName, apiVersion));

        return (
          <div key={unit.character_id} className="flex flex-col items-center">
            <div className="flex">
              {Array.from({ length: unit.tier }).map((_, index) => (
                <StarIcon key={index} className="h-3 w-3 text-yellow-400" />
              ))}
            </div>
            <div className="flex aspect-[1/1] border-blue-300 border">
              <Image
                src={championUrl}
                width={championImg.x}
                height={championImg.y}
                alt="character"
                style={{
                  objectFit: 'none',
                  objectPosition: `-${championImg.x}px -${championImg.y}px`,
                  width: `${championImg.w}px`,
                  height: `${championImg.h}px`,
                }}
                placeholder="blur"
                blurDataURL={BLUR_IMAGE_PATH}
              />
            </div>
            <div className="flex justify-between">
              {itemUrls.map((url, idx) => (
                <Image
                  key={idx}
                  className="w-4"
                  src={url}
                  width={12}
                  height={12}
                  alt="item"
                  blurDataURL={BLUR_IMAGE_PATH}
                />
              ))}
            </div>
          </div>
        );
      })
      .filter(Boolean);

    return (
      <div className="flex flex-col w-full h-full gap-2">
        <div className="flex gap-2 text-xs">{traitsMap}</div>
        <div className="flex gap-x-2">{unitsMap}</div>
      </div>
    );
  }

  getSubContent(match: TFTMatch) {
    return (
      <List
        items={match.participants}
        keyField="name"
        valueField="name"
        classes="hidden md:grid"
        itemClasses="w-28 text-xs"
        onItemClick={(item) => {
          const region = match.id.split('_')[0].toLowerCase();
          window.open(`/tft/profile/${region}/${encodeURIComponent(item.name)}`);
        }}
      />
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
      participants: info.participants.map((participant) => ({
        name: `${participant.riotIdGameName}#${participant.riotIdTagline}`,
      })),
      mode:
        gameModes.find((mode) => mode.key === info.tft_game_type)?.label ?? info.tft_game_type ?? info.tft_game_type,
      data: match,
      isWin: match.user.win,
    });
  }
}
