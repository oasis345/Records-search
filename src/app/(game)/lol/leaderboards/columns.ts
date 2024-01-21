import { LolStats } from '../models/stats';
import { defaultStatsColumns } from '../../defaultModel/columns';
import { ColumnDef } from '@tanstack/react-table';

export const lolColumns = [
  ...defaultStatsColumns,
  {
    accessorKey: 'losses',
    header: '패배',
  },
] as ColumnDef<LolStats>[];
