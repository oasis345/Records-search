import { ReactNode } from 'react';
import { Match, MatchHistoryItemBuilder } from '../../shared/model/match';
import { Match as TFTMatchInterface, Participant } from './interface';
import { tftService } from '@/app/services/tft.service';
import Image from 'next/image';
import { gameModes } from './gameModes';
import { Star as StarIcon } from 'lucide-react';
import { BLUR_IMAGE_PATH } from '@/app/utils';

const MIN_TIER_THRESHOLD = 1;

export class TFTMatchHistoryItemBuilder extends MatchHistoryItemBuilder<TFTMatch> {
  private currentMatch?: TFTMatch;

  getContents(data: TFTMatchInterface): ReactNode {
    const { user } = data;
    const apiVersion = this.resource.apiVersion;

    // 활성화된 특성만 필터링하고 티어 순으로 정렬
    const activeTraits = user.traits
      .filter((item) => item.tier_current >= MIN_TIER_THRESHOLD)
      .sort((a, b) => b.tier_current - a.tier_current)
      .slice(0, 6); // 최대 6개만 표시

    // 티어 스타일 색상
    const tierStyleColors: Record<number, string> = {
      1: 'bg-amber-800/60 border-amber-600 text-amber-200',
      2: 'bg-slate-500/60 border-slate-400 text-slate-200',
      3: 'bg-yellow-600/60 border-yellow-400 text-yellow-200',
      4: 'bg-purple-600/60 border-purple-400 text-purple-200',
    };

    const traitsMap = activeTraits.map((userTrait) => {
      const trait = this.resource.traits?.find((t: any) => t.id === userTrait.name);
      if (!trait?.image?.full) return null;

      const url = tftService.getImageUrl('trait', trait.image.full, apiVersion);
      const tierStyle = tierStyleColors[userTrait.tier_current] || 'bg-muted/50 border-border';

      return (
        <div
          key={userTrait.name}
          className={`flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.5 rounded border ${tierStyle}`}
          title={trait.name}
        >
          <Image
            src={url}
            width={16}
            height={16}
            alt={trait.name || 'trait'}
            className="w-3 h-3 sm:w-4 sm:h-4"
          />
          <span className="text-[9px] sm:text-[10px] font-bold">{userTrait.num_units}</span>
        </div>
      );
    }).filter(Boolean);

    // 유닛 맵핑
    const unitsMap = user.units.map((unit, idx) => {
      const champion = this.resource.champions?.find(
        (c: any) => c.id?.toLowerCase() === unit.character_id?.toLowerCase()
      );

      // 챔피언 이미지 URL - 직접 이미지 파일명 사용
      const imageFileName = champion?.image?.full || `${unit.character_id}.png`;
      const championUrl = tftService.getImageUrl('champion', imageFileName, apiVersion);

      // 아이템 이미지
      const itemImages = unit.itemNames?.slice(0, 3).map((itemName) => {
        const item = this.resource.items?.find(
          (i: any) => i.id === itemName || i.apiName === itemName
        );
        const itemFileName = item?.image?.full || `${itemName}.png`;
        return {
          url: tftService.getImageUrl('item', itemFileName, apiVersion),
          name: item?.name || itemName,
        };
      }) || [];

      // 티어(스타)에 따른 테두리 색상
      const tierBorderColors: Record<number, string> = {
        1: 'ring-zinc-500',
        2: 'ring-green-400',
        3: 'ring-yellow-400',
      };
      const tierBorder = tierBorderColors[unit.tier] || 'ring-zinc-500';

      // 코스트 배경색
      const costBgColors: Record<number, string> = {
        1: 'bg-zinc-700',
        2: 'bg-green-800',
        3: 'bg-blue-800',
        4: 'bg-purple-800',
        5: 'bg-yellow-700',
      };
      const costBg = costBgColors[champion?.tier || 1] || 'bg-zinc-700';

      return (
        <div key={`${unit.character_id}-${idx}`} className="flex flex-col items-center flex-shrink-0">
          {/* 스타 */}
          <div className="flex h-2.5 sm:h-3 mb-0.5">
            {Array.from({ length: unit.tier }).map((_, i) => (
              <StarIcon key={i} className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          {/* 챔피언 이미지 */}
          <div className={`relative rounded overflow-hidden ring-1 sm:ring-2 ${tierBorder} ${costBg}`}>
            <Image
              src={championUrl}
              width={40}
              height={40}
              alt={champion?.name || unit.character_id}
              className="w-7 h-7 sm:w-10 sm:h-10 object-cover"
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_PATH}
            />
          </div>
          {/* 아이템 */}
          {itemImages.length > 0 && (
            <div className="flex gap-px mt-0.5">
              {itemImages.map((item, i) => (
                <div key={i} className="rounded-sm overflow-hidden bg-black/40">
                  <Image
                    src={item.url}
                    width={12}
                    height={12}
                    alt={item.name}
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });

    return (
      <div className="flex flex-col gap-1 sm:gap-2 w-full">
        {/* 특성 */}
        <div className="flex flex-wrap gap-0.5 sm:gap-1">{traitsMap}</div>
        {/* 유닛 */}
        <div className="flex gap-1 sm:gap-1.5 overflow-x-auto pb-1">{unitsMap}</div>
      </div>
    );
  }

  getSubContent(match: TFTMatch) {
    const matchData = match.data as TFTMatchInterface;
    const participants = matchData.info.participants
      .slice()
      .sort((a, b) => a.placement - b.placement);

    // 1-4등 / 5-8등 분리
    const topHalf = participants.slice(0, 4);
    const bottomHalf = participants.slice(4, 8);

    const renderParticipant = (p: Participant) => {
      const isCurrentUser = p.puuid === matchData.user?.puuid;
      const isTop4 = p.placement <= 4;

      return (
        <div
          key={p.puuid}
          className={`flex items-center gap-1 px-1 py-0.5 rounded text-[11px] cursor-pointer hover:bg-muted/50 ${
            isCurrentUser ? 'bg-primary/10 font-medium' : ''
          }`}
          onClick={() => {
            const name = encodeURIComponent(`${p.riotIdGameName}#${p.riotIdTagline}`);
            const region = matchData.metadata.match_id.split('_')[0].toLowerCase();
            window.open(`/tft/profile/${region}/${name}`);
          }}
        >
          <span className={`w-4 text-center font-bold ${isTop4 ? 'text-blue-400' : 'text-red-400'}`}>
            {p.placement}
          </span>
          <span className={`truncate w-16 ${isCurrentUser ? 'text-foreground' : 'text-muted-foreground'}`}>
            {p.riotIdGameName || '?'}
          </span>
        </div>
      );
    };

    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
        <div className="flex flex-col gap-0.5">
          {topHalf.map(renderParticipant)}
        </div>
        <div className="flex flex-col gap-0.5">
          {bottomHalf.map(renderParticipant)}
        </div>
      </div>
    );
  }

  getClasses(): string {
    const ranking = this.currentMatch?.ranking ?? 8;
    return ranking <= 4 ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-red-500';
  }

  build(match: TFTMatch) {
    this.currentMatch = match;
    return super.build(match);
  }
}

export class TFTMatch extends Match {
  constructor(match: TFTMatchInterface) {
    const { metadata, info, user } = match;

    super({
      creationTime: info.game_datetime,
      durationTime: info.game_length,
      id: metadata.match_id,
      participants: info.participants.map((participant) => ({
        name: `${participant.riotIdGameName}#${participant.riotIdTagline}`,
      })),
      mode: gameModes.find((mode) => mode.key === info.tft_game_type)?.label ?? info.tft_game_type ?? info.tft_game_type,
      data: match,
      isWin: user?.placement <= 4,
      ranking: user?.placement,
    });
  }
}
