import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// React.ReactNode

export const AccordionCardItem: React.FC<AccordionCardItemProps> = ({ item, header, content, subContent, detail }) => {
  return (
    <AccordionItem value={item.key}>
      <div className="flex-col md:flex-row lg:flex-row flex my-2 items-center">
        {header}
        <div className="w-full flex justify-around">{content}</div>
        <div className="hidden w-80 md:flex lg:flex">{subContent}</div>
        <AccordionTrigger />
      </div>
      <AccordionContent>{detail}</AccordionContent>
    </AccordionItem>
  );
};
