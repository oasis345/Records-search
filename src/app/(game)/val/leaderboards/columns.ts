import { ValorantStats } from '../model/stats';
import { defaultStatsColumns } from '../../defaultModel/columns';

const columns = [
  {
    accessorKey: 'leaderboardRank',
    header: '#',
  },
  ...defaultStatsColumns,
] as {
  accessorKey: string;
  header: string;
}[];

const nameColumnIndex = columns.findIndex((column) => column.accessorKey === 'name');
const customNameColumn = {
  accessorKey: 'name',
  accessorFn: (data: ValorantStats) => {
    let name = `${data.name} #${data.tagLine}`;
    if (data.name === undefined) name = 'Secret Agent';

    return name;
  },
  header: '이름',
};

columns[nameColumnIndex] = customNameColumn;
export const valorantColumns = columns;
