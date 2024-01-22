'use client';

import { ProxyApiService } from '@/app/services/proxy.api.service';
import { valService } from '@/app/services/val.service';
import React, { useEffect, useRef } from 'react';
import { regions } from '../model/regions';
import { Act } from '../model/interface';
import { DataTable } from '@/app/components/table/DataTable';
import { valorantColumns } from './columns';
import { gameStatsToModel } from '../../defaultModel/utils';
import { ValorantStats } from '../model/stats';
import DropDown from '../../../components/buttons/DropDown';
import useQueryParams from '@/app/hooks/useQueryParams';

export default function Page() {
  const apiService = new ProxyApiService(valService);
  const [region, setRegion] = React.useState('kr');
  const [acts, setActs] = React.useState<Act[]>([]);
  const [actId, setActId] = React.useState('4401f9fd-4170-2e4c-4bc3-f3b4d7d150d1');
  const [data, setData] = React.useState<ValorantStats[]>([]);
  const tableRef = useRef();
  const { searchParams, setQueryParam } = useQueryParams();

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const getActName = (act: Act | '') => {
    if (!act) return '';

    const parentName = acts.find((parentAct) => parentAct.id === act.parentId)?.name;
    return `${parentName} ${act.name}`;
  };

  const fetchData = async (season?: string) => {
    if (acts.length == 0) {
      const contents = await apiService.getContents();
      setActs(contents.acts);
    }

    const updatedRegion = searchParams.get('region');
    const updatedActId = searchParams.get('act');
    const rankData = await apiService.getRanked({
      season: updatedActId ?? season ?? actId,
      region: updatedRegion ?? region,
    });
    const data = rankData.players.map((data: ValorantStats) => gameStatsToModel(data, 'val'));

    if (updatedActId) setActId(updatedActId);
    if (updatedRegion) setRegion(updatedRegion);

    setData(data);
  };

  return (
    <>
      <div>
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
          data={acts.filter((currentAct) => currentAct.type === 'act')}
          value={actId}
          keyField={'id'}
          labelField={'name'}
          getLabel={getActName}
          onSelect={(selectedItem: string) => {
            setActId(selectedItem);
            setQueryParam('act', selectedItem);
          }}
        ></DropDown>
      </div>

      <div className="flex flex-col">
        <DataTable ref={tableRef} columns={valorantColumns} data={data}></DataTable>
      </div>
    </>
  );
}
