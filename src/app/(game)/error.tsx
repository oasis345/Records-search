'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GameError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Game Error:', error);
  }, [error]);

  const isNotFound = error.message?.includes('Not Found') || error.message?.includes('404');
  const isTimeout = error.message?.includes('timeout') || error.message?.includes('Timeout');
  const isRateLimit = error.message?.includes('429') || error.message?.includes('Rate');

  let title = '오류가 발생했습니다';
  let description = '알 수 없는 오류가 발생했습니다.';

  if (isNotFound) {
    title = '데이터를 찾을 수 없습니다';
    description = '요청한 데이터가 존재하지 않거나 삭제되었습니다.';
  } else if (isTimeout) {
    title = '요청 시간이 초과되었습니다';
    description = '서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.';
  } else if (isRateLimit) {
    title = '요청이 너무 많습니다';
    description = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
  }

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            다시 시도
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Home className="w-4 h-4" />
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
