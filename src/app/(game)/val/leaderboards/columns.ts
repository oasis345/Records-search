import { ValorantStats } from '../stats';
import { defaultStatsColumns } from '../../columns';
import { ColumnDef } from '@tanstack/react-table';

export const valorantColumns: ColumnDef<ValorantStats>[] = [
  ...defaultStatsColumns,
  {
    accessorKey: 'puuid',
    header: 'PUUID',
  },

  {
    accessorKey: 'tagLine',
    header: 'Tag Line',
  },
] as ColumnDef<ValorantStats>[];
