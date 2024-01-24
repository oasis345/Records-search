import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigationCard } from './components/navigation/NavigationCard';
import { navigation } from './components/navigation/model';

export default function App() {
  const data = navigation.titles.map((title) => {
    return {
      ...title,
      imageSrc: `/${title.name}_banner.jpg`,
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
          <NavigationCard minColWidth={150} data={data} />
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
