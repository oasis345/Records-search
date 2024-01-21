import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({ minColWidth, data }) => {
  return (
    <Card
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}px, 1fr))`,
      }}
    >
      {data.map((item, index) => (
        <Card key={index} className={`relative ${!item.activated ? 'opacity-25' : ''}`}>
          <AspectRatio ratio={5 / 7} className="bg-muted">
            <Image fill src={item.imageSrc} alt="Image" sizes="100%" priority className="rounded-md object-cover" />
          </AspectRatio>

          <CardContent>
            <p>{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </Card>
  );
};
