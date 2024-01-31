'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dict } from '@/app/types/interface';

export default function DropDown({
  data,
  value,
  keyField,
  labelField,
  getLabel,
  onSelect,
}: {
  data: Dict[];
  value: string;
  keyField: string;
  labelField: string;
  getLabel?: (value: any) => string;
  onSelect: (selectedItem: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedData = data.find((currentData) => currentData[keyField] === value);
  const onSelected = (selectedValue: string) => {
    onSelect(selectedValue);
    setOpen(false);
  };

  return (
    <div className="w-fit">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[160px] justify-between">
            {getLabel?.(selectedData) ?? selectedData?.[labelField] ?? 'undefined'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[160px] p-0">
          <Command>
            <CommandGroup>
              {data.map((currentData) => (
                <CommandItem key={currentData[keyField]} value={currentData[keyField]} onSelect={onSelected}>
                  <Check
                    className={cn('mr-2 h-4 w-4', value === currentData[keyField] ? 'opacity-100' : 'opacity-0')}
                  />
                  {getLabel?.(currentData) ?? currentData[labelField]}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
