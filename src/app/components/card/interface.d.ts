interface ProfileCardProps {
  imageSrc: string;
  name: string;
}

interface ResponsiveCardProps {
  minColWidth: number;
  data: {
    imageSrc: string;
    activated?: boolean;
    label?: string;
  }[];
}
