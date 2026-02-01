'use client';
import { useSearchParams } from 'next/navigation';
import { defaultStatsColumns } from '../../shared/model/statsColumns';

const NameCell = ({ row }: { row: any }) => {
  const searchParams = useSearchParams();
  const region = searchParams.get('region') || 'kr';
  const data = row.original;
  const name = data.user ? `${data.name}#${data.user.tagLine}` : 'Unknown';
  const encodedName = encodeURIComponent(name);

  return (
    <span
      className="cursor-pointer hover:text-primary hover:underline transition-colors"
      onClick={() => {
        window.open(`/tft/profile/${region}/${encodedName}`, '_blank');
      }}
    >
      {name}
    </span>
  );
};

const statsColumns = [...defaultStatsColumns];
// @ts-ignore
const nameColumnIndex = statsColumns.findIndex((column) => column.accessorKey === 'name');
const customNameColumn = {
  accessorKey: 'name',
  accessorFn: (data: any) => {
    return data.user ? `${data.name}#${data.user.tagLine}` : 'Unknown';
  },
  header: '이름',
  cell: ({ row }: { row: any }) => <NameCell row={row} />,
};

statsColumns[nameColumnIndex] = customNameColumn;
export default statsColumns;
