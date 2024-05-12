export type Dict<T = any> = { [k: string]: T };

export type PageProps = {
  params: { slug: string[] };
  searchParams: { [key: string]: string | string[] | undefined };
};
