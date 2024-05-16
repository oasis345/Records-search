import React from 'react';
import { DataTable } from '@/app/components/table/DataTable';
import { defaultStatsColumns } from '../../model/statsColumns';
import { ColumnSort } from '@tanstack/react-table';
import LeaderboardFilters from './LeaderboardFilters';

export default function Leaderboard({
  queryParams,
  data = [],
  columns = defaultStatsColumns,
  sort = [{ id: 'score', desc: true }],
  children,
}: {
  queryParams: { key: string; value: any; items: any[] }[];
  data?: any[];
  columns?: any[];
  sort?: ColumnSort[];
  children?: React.ReactNode;
}) {
  return (
    <div className="container">
      <LeaderboardFilters queryParams={queryParams} />
      {children}
      <div className="flex flex-col">
        <DataTable columns={columns} data={data} sort={sort}></DataTable>
      </div>
    </div>
  );
}
