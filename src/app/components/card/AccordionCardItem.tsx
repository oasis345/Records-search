import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const AccordionCardItem: React.FC<AccordionCardItemProps> = ({
  classes,
  item,
  itemKey,
  header,
  content,
  subContent,
  detail,
}) => {
  return (
    <AccordionItem value={itemKey}>
      <div className={`${classes} flex`}>
        <div className="flex w-full flex-col md:flex-row lg:flex-row my-1 justify-between">
          <div className="flex items-center basis-auto">{header}</div>
          <div className="flex items-center grow">{content}</div>
          <div className="flex items-center w-1/4">{subContent}</div>
        </div>
        {detail ? <AccordionTrigger /> : null}
      </div>
      {detail && <AccordionContent>{detail}</AccordionContent>}
    </AccordionItem>
  );
};
