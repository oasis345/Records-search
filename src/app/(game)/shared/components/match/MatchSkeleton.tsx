import { Skeleton } from '@/app/components/skeleton/Skeleton';

export function MatchSkeleton() {
  const DefaultCount = 5;

  return (
    <div className="space-y-3">
      {[...Array(DefaultCount)].map((_, index) => (
        <div
          key={index}
          className="rounded-lg bg-muted/30 p-4 animate-pulse"
        >
          <div className="flex items-center gap-4">
            {/* Result Section */}
            <div className="flex flex-col gap-2 min-w-[100px]">
              <Skeleton classes="w-16 h-5 rounded-full" />
              <Skeleton classes="w-20 h-3 rounded" />
              <Skeleton classes="w-16 h-3 rounded" />
            </div>

            {/* Champion & Stats */}
            <div className="flex items-center gap-3">
              <Skeleton classes="w-14 h-14 rounded-xl" />
              <div className="flex flex-col gap-1">
                <Skeleton classes="w-6 h-6 rounded" />
                <Skeleton classes="w-6 h-6 rounded" />
              </div>
            </div>

            {/* KDA */}
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton classes="w-24 h-4 rounded" />
              <Skeleton classes="w-16 h-3 rounded" />
            </div>

            {/* Items */}
            <div className="hidden sm:grid grid-cols-4 gap-1">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} classes="w-7 h-7 rounded" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
