interface AccordionCardProps {
  type: 'multiple' | 'single';
  title: string;
  items: AccordionCardItemProps[];
  children?: React.ReactNode;
}

interface AccordionCardItemProps {
  item: any;
  itemKey: string;
  classes?: string;
  header: React.ReactNode;
  content: React.ReactNode;
  subContent: React.ReactNode;
  detail?: React.ReactNode;
}
