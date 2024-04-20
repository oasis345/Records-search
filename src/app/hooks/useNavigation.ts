import { usePathname, useRouter } from 'next/navigation';

export interface RouteParams {
  title: string;
  menu: string;
  region: string;
}

export const useNavigation = () => {
  const pathName = usePathname();
  const router = useRouter();

  const getRouteParams = (): RouteParams => {
    const result = pathName.match(/(\w+)/gi);
    const title = result?.[0] || '';
    const menu = result?.[1] || '/';
    const region = result?.[2] || '/';

    return {
      title,
      menu,
      region,
    };
  };

  return {
    currentTitle: getRouteParams().title,
    currentMenu: getRouteParams().menu,
    currentRegion: getRouteParams().region,
    getRouteParams,
    router,
  };
};
