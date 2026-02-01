'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { NavigationCardProps } from './interface';
import Link from 'next/link';
import Image from 'next/image';

export const NavigationCard: React.FC<NavigationCardProps> = ({ minColWidth, data }) => {
  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`,
      }}
    >
      {data.map((item, index: number) => (
        <Link
          key={index}
          className={`group block ${!item.activated ? 'pointer-events-none' : ''}`}
          href={item.activated ? item.href : '#'}
        >
          <div
            className={`relative overflow-hidden rounded-xl border-2 border-transparent transition-all duration-300 ${
              item.activated
                ? 'group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10'
                : 'opacity-40 grayscale'
            }`}
          >
            <AspectRatio ratio={21 / 9}>
              <Image
                fill
                src={item.imageSrc}
                alt={item.label}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover object-center transition-transform duration-500 ${
                  item.activated ? 'group-hover:scale-105' : ''
                }`}
                priority
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${
                  item.activated ? 'group-hover:from-black/90' : ''
                }`}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">{item.label}</h3>
                {!item.activated && (
                  <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs text-white/80">
                    Coming Soon
                  </span>
                )}
                {item.activated && (
                  <span className="inline-flex items-center text-sm text-white/80 group-hover:text-white transition-colors">
                    전적 검색하기
                    <svg
                      className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </div>
            </AspectRatio>
          </div>
        </Link>
      ))}
    </div>
  );
};
