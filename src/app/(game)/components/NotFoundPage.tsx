import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import Link from 'next/link';

export const NotFoundUserPage = ({
  title,
  region,
  searchText,
}: {
  title: string;
  region: string;
  searchText: string;
}) => {
  return (
    <Card className="container flex justify-center">
      <CardHeader>
        <p>{`'${region.toUpperCase()}'지역 내 '${searchText}'검색 결과가 업습니다.`}</p>
        <Link href={`/${title}`}>
          <Button className="w-full">돌아가기</Button>
        </Link>
      </CardHeader>
    </Card>
  );
};
