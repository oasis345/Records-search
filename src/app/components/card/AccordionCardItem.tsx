import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// React.ReactNode

export const AccordionCardItem: React.FC<AccordionCardItemProps> = ({ item, header, content, subContent, detail }) => {
  return (
    <AccordionItem value={item.key}>
      <div className="flex-col md:flex-row lg:flex-row flex my-1 justify-between">
        <div className="flex w-fit items-center">{header}</div>
        <div className="flex w-full">{content}</div>
        <div className="hidden md:flex lg:flex">{subContent}</div>
        {<AccordionTrigger />}
      </div>
      {detail && <AccordionContent>{detail}</AccordionContent>}
    </AccordionItem>
  );
};

// className="hidden md:flex lg:flex"
