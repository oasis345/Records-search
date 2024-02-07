import { riotService } from '@/app/services/riot.service';
import { Participant, RiotApiResource } from '../../../model/interface';
import { List } from '@/app/components/list/List';

const ParticipantList: React.FC<{ participants: Participant[]; resource: RiotApiResource; region: string }> = ({
  region,
  participants,
  resource,
}) => {
  return (
    <List
      items={participants}
      keyField="puuid"
      valueField="summonerName"
      classes="hidden lg:grid md:grid grid w-40 gap-1"
      itemClasses="flex w-28 text-xs text-ellipsis overflow-hidden text-nowrap"
      imageOptions={{
        getImageSrc: (item: Participant) => riotService.getImageUrl('champion', item.championName, resource.apiVersion),
        size: 18,
      }}
      onItemClick={(item) => window.open(`/lol/profile/${region}/${item.summonerName}`)}
    />
  );
};

export default ParticipantList;
