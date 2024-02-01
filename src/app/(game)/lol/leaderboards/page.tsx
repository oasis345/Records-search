'use client';

import React, { useEffect, useRef } from 'react';
import { regions } from '../models/regions';
import { tiers as tierData } from '../models/tiers';
import { DataTable } from '@/app/components/table/DataTable';
import { lolColumns } from './columns';
import { gameStatsToModel } from '../../model/utils';
import { LolStats } from '../models/stats';
import DropDown from '../../../components/buttons/DropDown';
import useQueryParams from '@/app/hooks/useQueryParams';
import { httpService } from '@/app/services/rest.data.service';

export default function Page() {
  const { searchParams, setQueryParam } = useQueryParams();
  const [region, setRegion] = React.useState('kr');
  const [tiers] = React.useState(tierData);
  const [tier, setTier] = React.useState('CHALLENGER');
  const [data, setData] = React.useState([]);

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    const params = {
      region,
      tier,
      queue: 'RANKED_SOLO_5x5',
      division: 'I',
    };
    const result = await httpService.get({ url: '/api/lol/getLeaderBoard', params });
    const data = result.map((data: LolStats) => gameStatsToModel(data, 'lol'));
    setData(data);
  };

  return (
    <>
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
        <DataTable columns={lolColumns} data={data}></DataTable>
      </div>
    </>
  );
}
