interface NavigationModel {
  titles: titles[];
  menus: Menus[];
}

type titles = {
  name: string;
  label: string;
  menus: Menus[];
};

type Menus = {
  name: string;
  path: string;
  label: string;
};
