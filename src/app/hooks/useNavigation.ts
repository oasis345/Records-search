import { usePathname, useRouter as useBaseRouter } from 'next/navigation';
import * as NProgress from 'nprogress';

export interface RouteParams {
  title: string;
  menu: string;
  region: string;
}

function useRouter() {
  const router = useBaseRouter();

  const { push } = router;

  router.push = async (...args: Parameters<typeof push>) => {
    NProgress.start();
    return push(...args);
  };

  return router;
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
