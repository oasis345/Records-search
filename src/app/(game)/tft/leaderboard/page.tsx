'use client';

import React, { useEffect } from 'react';
import { regions } from '../../lol/model/regions';
import { tiers } from '../model/tiers';
import { DataTable } from '@/app/components/table/DataTable';
import { tftColumns } from './columns';
import { gameStatsToModel } from '../../model/utils';
import { TFTStats } from '../model/stats';
import { httpService } from '@/app/services/httpService';
import DropDown from '../../../components/buttons/DropDown';
import useQueryParams from '@/app/hooks/useQueryParams';

export default function Page() {
  const { searchParams, setQueryParam } = useQueryParams();
  const [region, setRegion] = React.useState(searchParams.get('region') ?? 'kr');
  const [tier, setTier] = React.useState(searchParams.get('tier')?.toUpperCase() ?? 'CHALLENGER');
  const [data, setData] = React.useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const params = { region, tier };
      const result = await httpService.get<TFTStats[]>({ url: '/api/tft/leaderboard', params });
      const data = result.map((data: TFTStats) => gameStatsToModel<TFTStats>(data, 'lol'));

      setData(data);
    };

    fetchData();
  }, [region, tier]);

  return (
    <div className="container">
      <div className="flex">
        <DropDown
          data={regions}
          value={region}
          keyField={'name'}
          labelField={'label'}
          onSelect={(selectedItem: string) => {
            setRegion(selectedItem);
            setQueryParam('region', selectedItem);
          }}
        ></DropDown>
        <DropDown
          data={tiers}
          value={tier}
          keyField={'name'}
          labelField={'label'}
          onSelect={(selectedItem: string) => {
            // DropDown 버그로 인한 대문자 처리강제
            setTier(selectedItem.toUpperCase());
            setQueryParam('tier', selectedItem);
          }}
        ></DropDown>
      </div>
      <div className="flex flex-col">
        <DataTable columns={tftColumns} data={data} sort={[{ id: 'score', desc: true }]}></DataTable>
      </div>
    </div>
  );
}
