'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';
import { NavigationCardProps } from './interface';
import Link from 'next/link';
import Image from 'next/image';

export const NavigationCard: React.FC<NavigationCardProps> = ({ minColWidth, data }) => {
  return (
    <Card
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`,
      }}
    >
      {data.map((item, index: number) => (
        <Link
          key={index}
          className="group"
          style={{ cursor: item.activated ? 'pointer' : 'not-allowed' }}
          href={item.href}
        >
          <div className={`relative overflow-hidden rounded-md ${!item.activated ? 'opacity-25' : ''}`}>
            <AspectRatio ratio={5 / 7} className="transition duration-300 ease-in-out group-hover:scale-105">
              <Image fill src={item.imageSrc} alt="Image" sizes="100%" priority />
            </AspectRatio>
          </div>
          <p className="text-slate-500 dark:group-hover:text-white group-hover:font-bold">{item.label}</p>
        </Link>
      ))}
    </Card>
  );
};
