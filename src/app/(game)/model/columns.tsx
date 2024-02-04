'use client';
import { ColumnDef } from '@tanstack/react-table';
import { DefaultGameStats } from './stats';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

export const defaultStatsColumns: ColumnDef<DefaultGameStats>[] = [
  {
    accessorKey: 'name',
    header: '이름',
  },
  {
    accessorKey: 'tier',
    header: '티어',
  },
  {
    accessorKey: 'score',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <p>포인트</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'wins',
    header: '승리',
  },
  {
    accessorKey: 'losses',
    header: '패배',
  },
];
