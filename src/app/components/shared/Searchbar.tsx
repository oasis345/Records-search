'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-dropdown-menu';
import { debounce } from 'lodash';
import { useMemo, useState } from 'react';

export default function SearchBar({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  const search = (event) => {
    const value = event.target.value;
    onChange(value);
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input placeholder={placeholder} onChange={search} value={value} />
    </div>
  );
}
