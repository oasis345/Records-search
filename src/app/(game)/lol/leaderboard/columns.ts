import { defaultStatsColumns } from '../../model/columns';

export const lolColumns = [...defaultStatsColumns] as {
  accessorKey: string;
  header: string;
}[];
