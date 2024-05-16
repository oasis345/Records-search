import { ReactNode } from 'react';
import { Match, MatchHistoryItemBuilder } from '../../shared/model/match';
import { Match as TFTMatchInterface } from './interface';
import { tftService } from '@/app/services/tft.service';
import Image from 'next/image';
import { gameModes } from './gameModes';
import { List } from '@/app/components/list/List';
import { Star as StarIcon } from 'lucide-react';
import { BLUR_IMAGE_PATH } from '@/app/utils';

export class TFTMatchHistoryItemBuilder extends MatchHistoryItemBuilder<TFTMatch> {
  getContents(data: TFTMatchInterface): ReactNode {
    const { user } = data;
    const apiVersion = this.resource.apiVersion;
    const augmentsUrls = user.augments.map((userAugment) =>
      tftService.getImageUrl(
        'augment',
        this.resource.augments
          .find((augment: Record<string, any>) => augment.id === userAugment)
          ?.image?.full.slice(0, -4),
        apiVersion,
      ),
    );
    const traitsMap = user.traits
      .filter((item) => item.tier_current > 0)
      .map((userTrait) => {
        const trait = this.resource.traits.find((trait: Record<string, any>) => trait.id === userTrait.name);
        return {
          url: tftService.getImageUrl('trait', trait.image?.full.slice(0, -4), apiVersion),
          name: trait.name,
          length: userTrait.num_units,
        };
      });

    return (
      <div className="flex flex-col w-full h-full gap-2">
        <div className="flex gap-2">
          <div className="flex">
            {augmentsUrls.map((url, idx) => (
              <div key={idx} className="border-blue-300 border">
                <Image
                  className="w-4 md:w-6"
                  width={24}
                  height={24}
                  src={url}
                  alt="augment"
                  placeholder="blur"
                  blurDataURL={BLUR_IMAGE_PATH}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 text-xs">
            {traitsMap.map((trait, idx) => (
              <div key={idx} className="flex gap-1 items-center">
                <Image
                  className="w-4 md:w-6"
                  width={24}
                  height={24}
                  src={trait.url}
                  alt="trait"
                  placeholder="blur"
                  blurDataURL={BLUR_IMAGE_PATH}
                />
                <span className="hidden xl:block">{trait.name}</span>
                <span>{trait.length}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-x-2">
          {user.units.map((unit) => {
            const url = tftService.getImageUrl(
              'champion',
              this.resource.champions
                .find((champion: Record<string, any>) => champion.id === unit.character_id)
                ?.image?.full.slice(0, -4),
              apiVersion,
            );
            const stars = Array(unit.tier)
              // @ts-ignore
              .fill()
              .map(() => <StarIcon key={Math.random()} className="h-3 w-3" style={{ color: 'yellow' }} />);
            const itemUrls = unit.itemNames.map((itemName) => tftService.getImageUrl('item', itemName, apiVersion));

            return (
              <div key={Math.random()} className="flex flex-col items-center">
                <div className="flex">{stars.map((item) => item)}</div>
                <div className="flex aspect-[1/1] border-blue-300 border">
                  <Image
                    width={48}
                    height={48}
                    src={url}
                    alt="character"
                    className="w-6 md:w-8 lg:w-12 object-right object-cover"
                    placeholder="blur"
                    blurDataURL={BLUR_IMAGE_PATH}
                  />
                </div>
                <div className="flex justify-between">
                  {itemUrls.map((url, idx) => (
                    <Image
                      key={idx}
                      className="w-2 lg:w-4"
                      width={16}
                      height={16}
                      src={url}
                      alt="item"
                      placeholder="blur"
                      blurDataURL={BLUR_IMAGE_PATH}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  getSubContent(match: TFTMatch) {
    return (
      <List
        items={match.data.info.participants.map((item: any) => item.user)}
        keyField="id"
        valueField="gameName"
        classes="hidden md:grid"
        itemClasses="w-28 text-xs"
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
      participants: info.participants.map((participant) => ({ name: participant.user.gameName })),
      mode:
        gameModes.find((mode) => mode.key === info.tft_game_type)?.label ?? info.tft_game_type ?? info.tft_game_type,
      data: match,
      isWin: match.user.placement <= 4,
    });
  }
}
