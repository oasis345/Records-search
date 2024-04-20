import { defaultStatsColumns } from '../../shared/model/statsColumns';

const statsColumns = [
  // @ts-ignore
  ...defaultStatsColumns.filter((column) => column.accessorKey !== 'losses'),
  {
    accessorKey: 'averageDamage',
    accessorFn: (data: any) => {
      data = data.data;
      return data.attributes.stats.averageDamage;
    },
    header: '평균 데미지',
  },
  {
    accessorKey: 'kda',
    accessorFn: (data: any) => {
      data = data.data;
      return data.attributes.stats.kda.toFixed(2);
    },
    header: 'K/D',
  },
];

export default statsColumns;
