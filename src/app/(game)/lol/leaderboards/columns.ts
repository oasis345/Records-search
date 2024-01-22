import { defaultStatsColumns } from '../../defaultModel/columns';

export const lolColumns = [
  ...defaultStatsColumns,
  {
    accessorKey: 'losses',
    header: '패배',
  },
] as {
  accessorKey: string;
  header: string;
}[];
