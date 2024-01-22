import { usePathname, useRouter } from 'next/navigation';

export interface RouteParams {
  title: string;
}

export const useNavigation = () => {
  const pathName = usePathname();

  const getRouteParam = (): RouteParams => {
    const result = pathName.match(/(\w+)/gi);
    const title = result?.[0] || '';

    return {
      title,
    };
  };

  const getTitle = () => {
    return getRouteParam().title;
  };

  return {
    title: getTitle(),
    getRouteParam,
    router: useRouter(),
  };
};
