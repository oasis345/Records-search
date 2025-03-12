import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params;
    },
    [searchParams],
  );

  const setQueryParam = (queryName: string, value: string) => {
    router.push(`${pathname}?${createQueryString(queryName, value)}`);
  };

  return { searchParams, createQueryString, setQueryParam };
}
