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

  return (
    <div className="flex">
      {params.map((param) => (
        <DropDown
          key={param.key}
          data={param.items}
          value={param.value}
          onSelect={(selectedItem: string) => onSelect(param.key, selectedItem)}
        ></DropDown>
      ))}
    </div>
  );
}
