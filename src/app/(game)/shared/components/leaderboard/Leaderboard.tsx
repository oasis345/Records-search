import React from 'react';
import { DataTable } from '@/app/components/table/DataTable';
import { defaultStatsColumns } from '../../model/statsColumns';
import { ColumnSort } from '@tanstack/react-table';
import LeaderboardFilters from './LeaderboardFilters';

export default function Leaderboard({
  params,
  data = [],
  columns = defaultStatsColumns,
  sort = [{ id: 'score', desc: true }],
  children,
}: {
  params: { key: string; value: any; items: any[] }[];
  data?: any[];
  columns?: any[];
  sort?: ColumnSort[];
  children?: React.ReactNode;
}) {
  return (
    <div className="container">
      <LeaderboardFilters params={params} />
      {children}
      <div className="flex flex-col">
        <DataTable columns={columns} data={data} sort={sort}></DataTable>
      </div>
    </div>
  );
}
