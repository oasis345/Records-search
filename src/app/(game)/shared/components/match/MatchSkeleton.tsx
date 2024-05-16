import { Skeleton } from '@/app/components/skeleton/Skeleton';

export function MatchSkeleton() {
  const DefaultCount = 10;

  return (
    <div>
      {[...Array(DefaultCount)].map((_, index) => (
        <Skeleton key={index} classes="w-full h-24 mb-5">
          <div className="flex w-full h-full px-5 items-center gap-5">
            <Skeleton classes="w-16 h-16 rounded-full" />
            <Skeleton classes="w-full h-16" />
          </div>
        </Skeleton>
      ))}
    </div>
  );
}
