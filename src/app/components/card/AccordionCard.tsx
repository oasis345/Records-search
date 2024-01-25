import { Accordion } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccordionCardItem } from './AccordionCardItem';

export const AccordionCard: React.FC<AccordionCardProps> = ({ title, type, items }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type={type} className="w-full">
          {items.map((item, index) => (
            <AccordionCardItem
              key={item.key}
              item={item}
              header={item.header}
              content={item.content}
              subContent={item.subContent}
              detail={item.detail}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};
