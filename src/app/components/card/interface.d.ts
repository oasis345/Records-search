interface AccordionCardProps {
  type: 'multiple' | 'single';
  title: string;
  items: AccordionCardItemProps[];
}

interface AccordionCardItemProps {
  key: string;
  item: any;
  header: React.ReactNode;
  content: React.ReactNode;
  subContent: React.ReactNode;
  detail?: React.ReactNode;
}
