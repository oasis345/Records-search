export interface Navigation {
  titles: Title[];
  menus: Menu[];
}

type Title = {
  name: string;
  label: string;
  menus: Menu[];
  href: string;
  activated?: boolean;
  icon?: string;
};

type Menu = {
  name: string;
  href: string;
  label: string;
};

interface NavigationCardProps {
  minColWidth: number;
  data: Array<Omit<Title, 'menus'> & { imageSrc: string }>;
}
