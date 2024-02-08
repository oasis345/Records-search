export type Dict<T = any> = { [k: string]: T };

export type SearchItem = {
  title: string;
  name: string;
  region?: string;
  tag?: string;
  isFavorite: boolean;
};
