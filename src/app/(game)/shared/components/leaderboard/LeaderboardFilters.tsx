'use client';

import React from 'react';
import DropDown from '../../../../components/buttons/DropDown';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/app/hooks/useNavigation';

export default function LeaderboardFilters({ params }: { params: { key: string; value: any; items: any[] }[] }) {
  const router = useRouter();
  const navigation = useNavigation();

  const onSelect = (key: string, selectedItem: string) => {
    const updatedParams = params.map((param) => (param.key === key ? { key: key, value: selectedItem } : param));
    const updatedPath = `${navigation.currentTitle}/${navigation.currentMenu}/${updatedParams.map((param) => param.value).join('/')}`;

    router.push(`/${updatedPath}`);
  };

  const labelMap: Record<string, string> = {
    region: '지역',
    tier: '티어',
  };

  return (
    <div className="flex flex-wrap gap-2">
      {params.map((param) => (
        <div key={param.key} className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">{labelMap[param.key] || param.key}:</span>
          <DropDown
            data={param.items}
            value={param.value}
            onSelect={(selectedItem: string) => onSelect(param.key, selectedItem)}
          />
        </div>
      ))}
    </div>
  );
}
