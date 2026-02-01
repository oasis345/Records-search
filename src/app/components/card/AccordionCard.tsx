import { Accordion } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccordionCardItem } from './AccordionCardItem';
import { History } from 'lucide-react';

export const AccordionCard: React.FC<AccordionCardProps> = ({ title, type, items, children }) => {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="w-5 h-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <Accordion type={type} className="w-full space-y-2">
          {items.map((item) => (
            <AccordionCardItem key={item.itemKey} {...item} />
          ))}
        </Accordion>
        {children}
      </CardContent>
    </Card>
  );
};
