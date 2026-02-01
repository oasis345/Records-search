'use client';
import { usePathname } from 'next/navigation';
import { defaultStatsColumns } from '../../shared/model/statsColumns';

const NameCell = ({ row }: { row: any }) => {
  const pathname = usePathname();
  // URL pattern: /lol/leaderboard/{region}/{tier}
  const pathSegments = pathname.split('/');
  const region = pathSegments[3] || 'kr';
  const data = row.original;
  const name = `${data.name}#${data.user?.tagLine}`;
  const encodedName = encodeURIComponent(name);

  return (
    <span
      className="cursor-pointer hover:text-primary hover:underline transition-colors"
      onClick={() => {
        window.open(`/lol/profile/${region}/${encodedName}`, '_blank');
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
    return `${data.name}#${data.user?.tagLine}`;
  },
  header: '이름',
  cell: ({ row }: { row: any }) => <NameCell row={row} />,
};

statsColumns[nameColumnIndex] = customNameColumn;
export default statsColumns;
