import { Card, CardHeader } from '@/components/ui/card';

const NotFoundUser = ({ region, searchText }: { region: string; searchText: string }) => {
  return (
    <Card className="container flex justify-center">
      <CardHeader>
        <p>
          <span>{`'${region.toUpperCase()}'지역 내 `}</span>
          <span className="underline decoration-sky-500">{searchText}</span>
          <span>검색 결과가 업습니다.</span>
        </p>
      </CardHeader>
    </Card>
  );
};

export default NotFoundUser;
