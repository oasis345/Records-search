import { ColumnDef } from '@tanstack/react-table';
import { DefaultGameStats } from './gameStats';

export const defaultStatsColumns: ColumnDef<DefaultGameStats>[] = [
  {
    accessorKey: 'name',
    header: '이름',
  },
  {
    accessorKey: 'tier',
    header: '티어',
  },
  {
    accessorKey: 'score',
    header: '포인트',
  },
  {
    accessorKey: 'totalWins',
    header: '승리',
  },
];
