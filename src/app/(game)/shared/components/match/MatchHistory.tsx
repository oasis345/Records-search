'use client';
import { AccordionCard } from '@/app/components/card/AccordionCard';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Match, MatchHistoryItemBuilder } from '../../model/match';
import React from 'react';
import { MatchSkeleton } from './MatchSkeleton';

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
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = React.useState<AccordionCardItemProps[]>([]);

  const buildMatchItem = useCallback(
    (matchData: Match[]) => {
      const builder = new itemBuilder(resource);
      return matchData.map((match) => builder.build(match));
    },
    [itemBuilder, resource],
  );

  const onBtnClicked = async () => {
    if (disableFetch || !hasMore) return;

    try {
      setIsLoading(true);
      const responseData = await fetchMatchData!(data.length);
      if (responseData.length === 0) {
        setHasMore(false);
      } else {
        setData([...data, ...responseData]);
      }
    } catch (error) {
      console.error('Fetch Match Data Failed');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const matchItem = buildMatchItem(data);
    setItems([...matchItem]);
  }, [data, buildMatchItem]);

  return (
    <div className="container px-4">
      {!items.length ? (
        <AccordionCard title="매치 이력" type="multiple" items={[]}>
          <MatchSkeleton />
        </AccordionCard>
      ) : (
        <div className="flex flex-col gap-4">
          <AccordionCard title="매치 이력" type="multiple" items={items} />
          {!disableFetch && hasMore && (
            <Button
              variant="outline"
              size="lg"
              disabled={isLoading}
              className="w-full bg-muted/30 hover:bg-muted/50 border-dashed"
              onClick={onBtnClicked}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  로딩 중...
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  더 보기
                </>
              )}
            </Button>
          )}
          {!hasMore && items.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              모든 매치를 불러왔습니다
            </p>
          )}
        </div>
      )}
    </div>
  );
}
