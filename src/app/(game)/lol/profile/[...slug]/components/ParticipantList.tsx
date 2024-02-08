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
      valueField="riotIdGameName"
      classes="hidden lg:grid md:grid"
      itemClasses="flex w-28 text-xs"
      imageOptions={{
        getImageSrc: (item: Participant) => riotService.getImageUrl('champion', item.championName, resource.apiVersion),
        size: 18,
      }}
      onItemClick={(item) => {
        const name = encodeURIComponent(`${item.riotIdGameName}#${item.riotIdTagline}`);
        window.open(`/lol/profile/${region}/${name}`);
      }}
    />
  );
};

export default ParticipantList;
