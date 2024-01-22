import { games } from './(game)/defaultModel/model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveCard } from './components/card/ResponsiveCard';

export default function App() {
  const data = games.map((game) => {
    const { activated, key, label } = game;

    return {
      activated,
      imageSrc: `/${key}_banner.jpg`,
      label,
    };
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <p>지원 게임 리스트 </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveCard minColWidth={150} data={data} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <p>News</p>
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  );
}
