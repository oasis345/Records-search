import { secondsToMinutes } from '@/app/utils';
import { Match, Participant, ApiResource } from '../../../model/interface';
import Image from 'next/image';
import { lolService } from '@/app/services/lol.service';

const MainContent: React.FC<{
  match: Match;
  participant: Participant;
  isDetail?: boolean;
  resource: ApiResource;
}> = ({ match, participant, isDetail, resource }) => {
  const { spells, apiVersion } = resource;
  const { kills, assists, deaths, riotIdGameName, riotIdTagline, totalDamageTaken, totalMinionsKilled } = participant;
  const average = (kills + assists) / deaths;
  const fixedAverage = average.toFixed(2);
  const rating = isNaN(average) ? 0 : fixedAverage === 'Infinity' ? 'Perfect' : fixedAverage;
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
          <div key={itemKey} className="border-blue-300 border">
            <Image
              width={size}
              height={size}
              style={{ height: `${size}px` }}
              src={lolService.getImageUrl('item', itemNumber, apiVersion)}
              alt="Item Image"
            />
          </div>,
        );
      }
    }

    return items;
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex text-xs text-nowrap items-center grow shrink-0">
        <div className="flex">
          <div className="border-blue-300 border">
            <Image
              width={isDetail ? 34 : 48}
              height={isDetail ? 34 : 48}
              src={lolService.getImageUrl('champion', participant.championName, apiVersion)}
              alt="Champion Image"
            />
          </div>
          <div className="grid grid-cols-1 gap-1 px-1">
            <div className="border-blue-300 border">
              <Image
                width={isDetail ? 15 : 22}
                height={isDetail ? 15 : 22}
                src={lolService.getImageUrl('spell', spell1, apiVersion)}
                alt="spell_1"
              />
            </div>
            <div className="border-blue-300 border">
              <Image
                width={isDetail ? 15 : 22}
                height={isDetail ? 15 : 22}
                src={lolService.getImageUrl('spell', spell2, apiVersion)}
                alt="spell_2"
              />
            </div>
          </div>
        </div>
        <div className="items-center grow">
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
