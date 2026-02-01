import { Loader2 } from 'lucide-react';

export default function GameLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">데이터를 불러오는 중...</p>
      </div>
    </div>
  );
}
