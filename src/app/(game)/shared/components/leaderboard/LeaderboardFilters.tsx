'use client';

import React from 'react';
import DropDown from '../../../../components/buttons/DropDown';
import useQueryParams from '@/app/hooks/useQueryParams';
export default function LeaderboardFilters({
  queryParams,
}: {
  queryParams: { key: string; value: any; items: any[] }[];
}) {
  const { setQueryParam, searchParams } = useQueryParams();
  const [queryParamsMap, setQueryParamsMap] = React.useState(
    new Map<string, any>(
      queryParams.map((queryParam) => [queryParam.key, searchParams.get(queryParam.key) ?? queryParam.value]),
    ),
  );

  return (
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
  );
}
