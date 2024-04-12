import { defaultStatsColumns } from '../../shared/model/statsColumns';

export const statsColumns = [...defaultStatsColumns] as {
  accessorKey: string;
  header: string;
}[];
