import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const NotFoundUser = ({ region, searchText }: { region: string; searchText: string }) => {
  return (
    <div className="container py-12 px-4">
      <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/30 max-w-lg mx-auto">
        <CardContent className="py-12 text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">검색 결과 없음</h3>
          <p className="text-muted-foreground mb-4">
            <span className="font-medium text-primary">{region.toUpperCase()}</span> 지역에서{' '}
            <span className="font-semibold text-foreground">&quot;{searchText}&quot;</span>을(를) 찾을 수 없습니다.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            닉네임과 태그를 정확히 입력했는지 확인해주세요.
            <br />
            예: 플레이어이름#KR1
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로 돌아가기
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundUser;
