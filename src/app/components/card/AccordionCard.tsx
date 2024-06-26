import { Accordion } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccordionCardItem } from './AccordionCardItem';

export const AccordionCard: React.FC<AccordionCardProps> = ({ title, type, items, children }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type={type} className="w-full">
          {items.map((item) => (
            <AccordionCardItem key={item.itemKey} {...item} />
          ))}
        </Accordion>
        {children}
      </CardContent>
    </Card>
  );
};
