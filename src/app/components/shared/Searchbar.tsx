'use client';

import { debounce } from 'lodash';
import { useMemo, useState } from 'react';

export default function SearchBar() {
  const [searchText, setSearchText] = useState('asd');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);

    search(value);
  };

  const search = useMemo(
    () =>
      debounce((value) => {
        console.log(value);
      }, 400),
    []
  );

  return (
    <div className="container max-w-screen-md mx-auto">
      <form>
        <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <input
            type="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50
              focus:ring-blue-500 focus:border-blue-500
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          ></input>
        </div>
      </form>
    </div>
  );
}
