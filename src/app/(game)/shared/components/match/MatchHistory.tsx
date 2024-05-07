'use client';
import { AccordionCard } from '@/app/components/card/AccordionCard';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { Match, MatchHistoryItemBuilder } from '../../model/match';
import React from 'react';
import { BaseSkeleton } from '@/app/components/skeleton/Skeleton';

export default function MatchHistory({
  matchData: initialMatches = [],
  itemBuilder,
  resource,
  fetchMatchData,
  disableFetch = false,
}: {
  matchData: Match[];
  itemBuilder: new (resource: any) => MatchHistoryItemBuilder;
  resource: any;
  fetchMatchData?: (startIndex: number) => Promise<Match[]>;
  disableFetch?: boolean;
}) {
  const [data, setData] = useState(initialMatches);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = React.useState<AccordionCardItemProps[]>([]);

  const buildMatchItem = useCallback(
    (matchData: Match[]) => {
      const builder = new itemBuilder(resource);
      return matchData.map((match) => builder.build(match));
    },
    [itemBuilder],
  );

  const onBtnClicked = async () => {
    if (disableFetch) return;

    try {
      setIsLoading(true);
      const responseData = await fetchMatchData!(data.length);
      setData([...data, ...responseData]);
    } catch (error) {
      console.error('fetch failed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const matchItem = buildMatchItem(data);
    setItems([...matchItem]);
  }, [data]);

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <BaseSkeleton classes="h-4 w-full" />
      ) : (
        <AccordionCard title="매치 이력" type="multiple" items={items} />
      )}

      {disableFetch ?? (
        <Button disabled={isLoading} className="w-full" onClick={onBtnClicked}>
          {isLoading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : `더 보기`}
        </Button>
      )}
    </div>
  );
}
