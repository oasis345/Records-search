'use client';
import React, { useEffect, useState } from 'react';
import { AccordionCard } from '@/app/components/card/AccordionCard';
import { Summoner } from '../../../../lol/model/interface';
import { Match, Participant, ApiResource } from '../../../model/interface';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import MatchResult from '@/app/(game)/components/MatchResult';
import { tftService } from '@/app/services/tft.service';
import Image from 'next/image';

export default function Container({
  region,
  summoner,
  matches: initialMatches,
  resource,
}: {
  region: string;
  summoner: Summoner;
  matches: Match[];
  resource: ApiResource;
}) {
  const [accordionItems, setAccordionItems] = React.useState<AccordionCardItemProps[]>([]);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAccordionItems([...createAccordionItems(matches)]);
  }, [matches]);

  const createAccordionItems = (matches: Match[]) => {
    return matches.map((match) => {
      const {
        metadata: { match_id },
        info: { participants, game_datetime, game_length, tft_game_type, ...info },
      } = match;
      const myInfo = participants.find((participant) => participant.puuid === summoner?.puuid)!;

      console.log(resource);
      return {
        itemKey: match_id,
        item: match,
        classes: 'h-28',
        header: (
          <MatchResult
            matchResult={{
              creationTime: game_datetime,
              durationTime: game_length,
              mode: tft_game_type,
            }}
          />
        ),
        content: (
          <div className="flex w-full h-full gap-2">
            {myInfo.units.map((unit) => {
              const url = tftService.getImageUrl(
                'champion',
                resource.champions.find((champion: Record<string, any>) => champion.id === unit.character_id)?.image
                  ?.full,
                resource.apiVersion,
              );
              debugger;
              return (
                <div key={Math.random()} className="relative w-12 h-12">
                  <Image fill src={url} alt="character" objectPosition="right" objectFit="cover" />
                </div>
              );
            })}
          </div>
        ),
        subContent: <></>,
        detail: <></>,
      };
    });
  };

  return (
    <div>
      <AccordionCard title="매치 이력" type="multiple" items={accordionItems}></AccordionCard>
      <Button disabled={isLoading} className="w-full">
        {isLoading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : `더 보기`}
      </Button>
    </div>
  );
}
