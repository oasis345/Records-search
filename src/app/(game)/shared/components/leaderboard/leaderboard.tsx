'use client';

import React, { ReactChild, useEffect } from 'react';
import DropDown from '../../../../components/buttons/DropDown';
import useQueryParams from '@/app/hooks/useQueryParams';
import { useNavigation } from '@/app/hooks/useNavigation';
import { httpService } from '@/app/services/httpService';
import { GameStats } from '../../model/gameStats';
import { DataTable } from '@/app/components/table/DataTable';
import { defaultStatsColumns } from '../../model/statsColumns';
import { ColumnDef, ColumnSort } from '@tanstack/react-table';

export default function LeaderBoard({
  queryParams,
  columns = defaultStatsColumns,
  sort,
  children,
}: {
  queryParams: { key: string; value: any; items: any[] }[];
  columns?: any[];
  sort?: ColumnSort[];
  children?: React.ReactNode;
}) {
  const { setQueryParam } = useQueryParams();
  const { currentTitle } = useNavigation();
  const [queryParamsMap, setQueryParamsMap] = React.useState(
    new Map<string, any>(queryParams.map((queryParam) => [queryParam.key, queryParam.value])),
  );
  const [data, setData] = React.useState<GameStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const params = Object.fromEntries(queryParamsMap);
      const result = await httpService.get<GameStats[]>({ url: `/api/${currentTitle}/leaderboard`, params });

      setData(result);
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
        <DataTable columns={columns} data={data} sort={sort}></DataTable>
      </div>
    </div>
  );
}
