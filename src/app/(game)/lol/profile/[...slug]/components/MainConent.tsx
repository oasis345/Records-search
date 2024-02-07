import { BLUR_IMAGE_PATH, secondsToMinutes } from '@/app/utils';
import { Match, Participant, RiotApiResource } from '../../../model/interface';
import Image from 'next/image';
import { riotService } from '@/app/services/riot.service';

const MainContent: React.FC<{
  match: Match;
  participant: Participant;
  isDetail?: boolean;
  resource: RiotApiResource;
}> = ({ match, participant, isDetail, resource }) => {
  const { spells, apiVersion } = resource;
  const { kills, assists, deaths, riotIdGameName, riotIdTagline, totalDamageTaken, totalMinionsKilled } = participant;
  const rating = ((kills + assists) / deaths).toFixed(2);
  const csPerMinute = (totalMinionsKilled / secondsToMinutes(match.info.gameDuration).minutes).toFixed(1);
  const spell1 = spells.find((spell: Record<string, any>) => spell.key === String(participant.summoner1Id)).id;
  const spell2 = spells.find((spell: Record<string, any>) => spell.key === String(participant.summoner2Id)).id;
  const Items: React.FC<{ participant: Participant; size: number }> = ({ participant, size }) => {
    const MAX_ITEM_LENGTH = 6;
    const items = [];

    for (let index = 0; index <= MAX_ITEM_LENGTH; index++) {
      const itemKey = `item${index}`;
      // @ts-ignore
      const itemNumber: number = participant[itemKey];

      if (itemNumber !== 0) {
        items.push(
          <Image
            key={itemKey}
            width={size}
            height={size}
            style={{ height: `${size}px` }}
            src={riotService.getImageUrl('item', itemNumber, apiVersion)}
            alt="Item Image"
            placeholder="blur"
            blurDataURL={BLUR_IMAGE_PATH}
          />,
        );
      }
    }

    return items;
  };

  return (
    <div className="flex w-full p-2 items-center justify-between">
      <div className="flex text-xs text-nowrap items-center grow shrink-0">
        <div className="flex">
          <Image
            width={isDetail ? 34 : 48}
            height={isDetail ? 34 : 48}
            src={riotService.getImageUrl('champion', participant.championName, apiVersion)}
            alt="Champion Image"
            placeholder="blur"
            blurDataURL={BLUR_IMAGE_PATH}
          />
          <div className="grid grid-cols-1 gap-1 px-1">
            <Image
              width={isDetail ? 15 : 22}
              height={isDetail ? 15 : 22}
              src={riotService.getImageUrl('spell', spell1, apiVersion)}
              alt="spell_1"
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_PATH}
            />
            <Image
              width={isDetail ? 15 : 22}
              height={isDetail ? 15 : 22}
              src={riotService.getImageUrl('spell', spell2, apiVersion)}
              alt="spell_2"
              placeholder="blur"
              blurDataURL={BLUR_IMAGE_PATH}
            />
          </div>
        </div>
        <div className="items-center text-ellipsis overflow-hidden grow">
          {isDetail && <p>{`${riotIdGameName}`}</p>}
          <div className="flex font-bold text-xs items-center" style={{ flexDirection: isDetail ? 'row' : 'column' }}>
            <span className="flex">
              <p>{kills}</p> / <p className="text-red-500">{deaths}</p> / <p>{assists}</p>
            </span>

            <p className="text-gray-400">&nbsp;{rating}평점</p>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex md:flex flex-col items-center text-nowrap px-2 grow">
        <p className="text-xs"> {`cs ${totalMinionsKilled} (${csPerMinute}/m)`} </p>
        <p className="text-xs"> {`${totalDamageTaken} 피해량`} </p>
      </div>
      <div id="items" className="grid grid-cols-4 gap-1 px-2">
        <Items participant={participant} size={isDetail ? 22 : 28} />
      </div>
    </div>
  );
};

export default MainContent;
