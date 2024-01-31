import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// React.ReactNode

export const AccordionCardItem: React.FC<AccordionCardItemProps> = ({ item, header, content, subContent, detail }) => {
  return (
    <AccordionItem value={item.key}>
      <div className="flex w-full">
        <div className="flex w-full flex-col md:flex-row lg:flex-row my-1 justify-between">
          <div className="flex items-center basis-auto">{header}</div>
          <div className="flex items-center grow">{content}</div>
          <div className="flex">{subContent}</div>
        </div>
        {<AccordionTrigger />}
      </div>
      {detail && <AccordionContent>{detail}</AccordionContent>}
    </AccordionItem>
  );
};
