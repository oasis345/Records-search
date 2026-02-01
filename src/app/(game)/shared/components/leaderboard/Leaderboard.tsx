import React from 'react';
import { DataTable } from '@/app/components/table/DataTable';
import { defaultStatsColumns } from '../../model/statsColumns';
import { ColumnSort } from '@tanstack/react-table';
import LeaderboardFilters from './LeaderboardFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="container py-6 px-4">
      <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              랭킹
            </CardTitle>
            <LeaderboardFilters params={params} />
          </div>
        </CardHeader>
        <CardContent>
          {children}
          {data.length > 0 ? (
            <div className="rounded-lg overflow-hidden border border-border">
              <DataTable columns={columns} data={data} sort={sort} />
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>랭킹 데이터를 불러올 수 없습니다.</p>
              <p className="text-sm mt-1">API 키가 설정되지 않았거나 서버에 문제가 있을 수 있습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
