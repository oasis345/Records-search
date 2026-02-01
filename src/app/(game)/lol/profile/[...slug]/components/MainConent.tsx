import { secondsToMinutes } from '@/app/utils';
import { Match, Participant, ApiResource } from '../../../model/interface';
import Image from 'next/image';
import { lolService } from '@/app/services/lol.service';
import { BLUR_IMAGE_PATH } from '@/app/utils';

const MainContent: React.FC<{
  match: Match;
  participant: Participant;
  isDetail?: boolean;
  resource: ApiResource;
}> = ({ match, participant, isDetail, resource }) => {
  const { spells, apiVersion } = resource;
  const { kills, assists, deaths, riotIdGameName, totalDamageDealtToChampions, totalMinionsKilled } = participant;
  const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths;
  const kdaText = deaths === 0 ? 'Perfect' : kda.toFixed(2);
  const csPerMin = (totalMinionsKilled / secondsToMinutes(match.info.gameDuration).minutes).toFixed(1);

  const spell1 = spells.find((s: any) => s.key === String(participant.summoner1Id))?.id;
  const spell2 = spells.find((s: any) => s.key === String(participant.summoner2Id))?.id;

  const getKdaColor = () => {
    if (kdaText === 'Perfect') return 'text-yellow-500';
    if (kda >= 5) return 'text-yellow-500';
    if (kda >= 4) return 'text-blue-500';
    if (kda >= 3) return 'text-green-500';
    return 'text-muted-foreground';
  };

  // 아이템 렌더링
  const renderItems = (size: number) => {
    const items = [];
    for (let i = 0; i <= 6; i++) {
      // @ts-ignore
      const itemNum: number = participant[`item${i}`];
      items.push(
        itemNum !== 0 ? (
          <Image
            key={i}
            width={size}
            height={size}
            src={lolService.getImageUrl('item', itemNum, apiVersion)}
            alt=""
            className="rounded"
            style={{ width: size, height: size }}
            placeholder="blur"
            blurDataURL={BLUR_IMAGE_PATH}
          />
        ) : (
          <div key={i} className="rounded bg-muted/30" style={{ width: size, height: size }} />
        )
      );
    }
    return items;
  };

  // 디테일 모드 (참가자 목록에서 사용)
  if (isDetail) {
    const handleNameClick = () => {
      const name = encodeURIComponent(`${participant.riotIdGameName}#${participant.riotIdTagline}`);
      const region = match.info.platformId.toLowerCase();
      window.open(`/lol/profile/${region}/${name}`, '_blank');
    };

    return (
      <div className="flex items-center gap-1.5 sm:gap-3 w-full">
        {/* 챔피언 + 스펠 */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <div className="relative">
            <Image
              width={32}
              height={32}
              src={lolService.getImageUrl('champion', participant.championName, apiVersion)}
              alt=""
              className="w-7 h-7 sm:w-8 sm:h-8 rounded ring-1 ring-border"
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_PATH}
            />
            {participant.champLevel && (
              <span className="absolute -bottom-0.5 -right-0.5 bg-black text-white text-[7px] sm:text-[8px] font-bold w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center">
                {participant.champLevel}
              </span>
            )}
          </div>
          <div className="hidden sm:flex flex-col gap-0.5">
            {spell1 && (
              <Image
                width={14}
                height={14}
                src={lolService.getImageUrl('spell', spell1, apiVersion)}
                alt=""
                className="rounded"
              />
            )}
            {spell2 && (
              <Image
                width={14}
                height={14}
                src={lolService.getImageUrl('spell', spell2, apiVersion)}
                alt=""
                className="rounded"
              />
            )}
          </div>
        </div>

        {/* 이름 + KDA */}
        <div className="flex flex-col min-w-[50px] sm:min-w-[70px]">
          <span
            className="text-[10px] sm:text-xs font-medium truncate max-w-[60px] sm:max-w-[80px] cursor-pointer hover:text-primary hover:underline transition-colors"
            onClick={handleNameClick}
          >
            {riotIdGameName}
          </span>
          <div className="flex items-center gap-0.5 text-[9px] sm:text-[11px]">
            <span>{kills}</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-red-500">{deaths}</span>
            <span className="text-muted-foreground">/</span>
            <span>{assists}</span>
            <span className={`hidden sm:inline ml-1 ${getKdaColor()} text-[10px]`}>({kdaText})</span>
          </div>
        </div>

        {/* CS & 피해량 */}
        <div className="hidden md:flex flex-col text-[10px] text-muted-foreground min-w-[60px]">
          <span>CS {totalMinionsKilled}</span>
          <span>{((totalDamageDealtToChampions || 0) / 1000).toFixed(1)}k 피해량</span>
        </div>

        {/* 아이템 */}
        <div className="flex gap-px sm:gap-0.5 ml-auto flex-shrink-0">
          {renderItems(16)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* 챔피언 + 스펠 */}
      <div className="flex items-center gap-1">
        <div className="relative">
          <Image
            width={48}
            height={48}
            src={lolService.getImageUrl('champion', participant.championName, apiVersion)}
            alt=""
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg ring-2 ring-border"
            placeholder="blur"
            blurDataURL={BLUR_IMAGE_PATH}
          />
          {participant.champLevel && (
            <span className="absolute -bottom-1 -right-1 bg-black text-white text-[8px] sm:text-[9px] font-bold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center">
              {participant.champLevel}
            </span>
          )}
        </div>
        <div className="hidden sm:flex flex-col gap-0.5">
          {spell1 && (
            <Image
              width={20}
              height={20}
              src={lolService.getImageUrl('spell', spell1, apiVersion)}
              alt=""
              className="rounded"
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_PATH}
            />
          )}
          {spell2 && (
            <Image
              width={20}
              height={20}
              src={lolService.getImageUrl('spell', spell2, apiVersion)}
              alt=""
              className="rounded"
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_PATH}
            />
          )}
        </div>
      </div>

      {/* KDA */}
      <div className="flex flex-col min-w-[60px] sm:min-w-[90px]">
        <div className="flex items-baseline gap-0.5 text-xs sm:text-sm font-bold">
          <span>{kills}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-red-500">{deaths}</span>
          <span className="text-muted-foreground">/</span>
          <span>{assists}</span>
        </div>
        <span className={`text-[10px] sm:text-xs font-semibold ${getKdaColor()}`}>
          {kdaText} {kdaText !== 'Perfect' && 'KDA'}
        </span>
      </div>

      {/* CS & 피해량 */}
      <div className="hidden md:flex flex-col text-xs text-muted-foreground min-w-[70px]">
        <span>CS {totalMinionsKilled} ({csPerMin})</span>
        <span>{((totalDamageDealtToChampions || 0) / 1000).toFixed(1)}k 피해량</span>
      </div>

      {/* 아이템 */}
      <div className="flex gap-0.5 ml-auto">
        {renderItems(20)}
      </div>
    </div>
  );
};

export default MainContent;
