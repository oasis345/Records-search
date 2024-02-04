import { defaultStatsColumns } from '../../model/columns';

export const tftColumns = [...defaultStatsColumns] as {
  accessorKey: string;
  header: string;
}[];
