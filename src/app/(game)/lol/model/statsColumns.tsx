'use client';
import { defaultStatsColumns } from '../../shared/model/statsColumns';

const statsColumns = [...defaultStatsColumns];
// @ts-ignore
const nameColumnIndex = statsColumns.findIndex((column) => column.accessorKey === 'name');
const customNameColumn = {
  accessorKey: 'name',
  accessorFn: (data: any) => {
    let name = `${data.name}#${data.user?.tagLine}`;

    return name;
  },
  header: '이름',
};

statsColumns[nameColumnIndex] = customNameColumn;
export default statsColumns;
