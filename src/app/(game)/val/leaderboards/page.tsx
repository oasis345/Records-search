'use client';

import { ProxyApiService } from '@/app/services/proxy.api.service';
import { valService } from '@/app/services/val.service';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { regions } from '../../regions';
import { Act } from '../interface';
import { DataTable } from '@/app/components/table/DataTable';
import { valorantColumns } from './columns';
import { gameStatsToModel } from '../../../utils';
import { ValorantStats } from '../stats';
import DropDown from '../../../components/buttons/DropDown';

export default function Page() {
  const [showAct, setShowAct] = React.useState(false);
  const [region, setRegion] = React.useState('ko');
  const [acts, setActs] = React.useState<Act[]>([]);
  const [actId, setActId] = React.useState('');
  const [data, setData] = React.useState<ValorantStats[]>([]);

  useEffect(() => {
    const apiService = new ProxyApiService(valService);
    const fetchData = async () => {
      const contents = await apiService.getContents();
      const acts: Act[] = contents.acts;
      const activatedId = acts.find((currentAct) => currentAct.type === 'act' && currentAct.isActive === true)!.id;
      const rankData = await apiService.getRanked(activatedId);
      const players: ValorantStats[] = rankData.players;
      const data = players.map((data: ValorantStats) => gameStatsToModel<ValorantStats>(data, 'val'));

      setActs(acts);
      setActId(activatedId);
      setData(data);

      console.log(valorantColumns);
      console.log('acts', acts);
      console.log('ranks', rankData);
      console.log('contents', contents);
    };

    fetchData();
  }, []);

  function getActName(act: Act | undefined) {
    if (!act) return '';

    const parentName = acts.find((parentAct) => parentAct.id === act.parentId)?.name;
    return `${parentName} ${act.name}`;
  }

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
          }}
        ></DropDown>

        {/* <Popover open={showAct} onOpenChange={setShowAct}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={showAct} className="w-[200px] justify-between">
              {getActName(acts.find((currentAct) => currentAct.id === actId))}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandGroup>
                {acts
                  .filter((currentAct) => currentAct.type === 'act')
                  .map((currentAct) => (
                    <CommandItem
                      key={currentAct.id}
                      value={currentAct.id}
                      onSelect={(currentValue) => {
                        setActId(currentValue);
                        setShowAct(false);
                      }}
                    >
                      <Check className={cn('mr-2 h-4 w-4', actId === currentAct.id ? 'opacity-100' : 'opacity-0')} />
                      {getActName(currentAct)}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover> */}
      </div>

      <div className="flex flex-col">
        <DataTable columns={valorantColumns} data={data}></DataTable>
      </div>
    </>
  );
}
