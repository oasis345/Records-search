import { ValorantStats } from '../model/stats';
import { defaultStatsColumns } from '../../defaultModel/columns';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<ValorantStats>[] = [
  {
    accessorKey: 'leaderboardRank',
    header: '#',
  },
  ...defaultStatsColumns,
];
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
export const valorantColumns = columns as ColumnDef<ValorantStats>[];
