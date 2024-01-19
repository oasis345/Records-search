import { LolStats } from '../model/stats';
import { defaultStatsColumns } from '../../defaultModel/columns';
import { ColumnDef } from '@tanstack/react-table';

// accessorKey
// header
export const lolColumns = [
  ...defaultStatsColumns,
  {
    accessorKey: 'losses',
    header: '패배',
  },
] as ColumnDef<LolStats>[];
