'use client';

import React, { useEffect } from 'react';
import DropDown from '../../../../components/buttons/DropDown';
import useQueryParams from '@/app/hooks/useQueryParams';
import { useNavigation } from '@/app/hooks/useNavigation';
import { httpService } from '@/app/services/httpService';
import { GameStats } from '../../model/gameStats';
import { DataTable } from '@/app/components/table/DataTable';
import { defaultStatsColumns, skeletonColumns } from '../../model/statsColumns';
import { ColumnSort } from '@tanstack/react-table';

export default function Leaderboard({
  queryParams,
  columns = defaultStatsColumns,
  sort = [{ id: 'score', desc: true }],
  children,
}: {
  queryParams: { key: string; value: any; items: any[] }[];
  columns?: any[];
  sort?: ColumnSort[];
  children?: React.ReactNode;
}) {
  const { setQueryParam, searchParams } = useQueryParams();
  const { currentTitle } = useNavigation();
  const [queryParamsMap, setQueryParamsMap] = React.useState(
    new Map<string, any>(
      queryParams.map((queryParam) => [queryParam.key, searchParams.get(queryParam.key) ?? queryParam.value]),
    ),
  );
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<GameStats[]>([]);
  const tableColumns: any = React.useMemo(() => (loading ? skeletonColumns : columns), [columns, loading]);
  const tableData = React.useMemo(() => (loading ? Array(30).fill({}) : data), [loading, data]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = Object.fromEntries(queryParamsMap);
      const result = await httpService.get<GameStats[]>({ url: `/api/${currentTitle}/leaderboard`, params });

      setData(result);
      setLoading(false);
    };

    fetchData();
  }, [queryParamsMap]);

  return (
    <div className="container">
      <div className="flex">
        {queryParams.map((queryParam) => (
          <DropDown
            key={queryParam.key}
            data={queryParam.items}
            value={queryParamsMap.get(queryParam.key)}
            onSelect={(selectedItem: string) => {
              setQueryParamsMap(new Map(queryParamsMap.set(queryParam.key, selectedItem)));
              setQueryParam(queryParam.key, selectedItem);
            }}
          ></DropDown>
        ))}
      </div>
      {children}
      <div className="flex flex-col">
        <DataTable columns={tableColumns} data={tableData} sort={sort}></DataTable>
      </div>
    </div>
  );
}
