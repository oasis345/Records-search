'use client';

import Link from 'next/link';
import * as React from 'react';
import { navigation } from './model';
import ThemeToggle from './ThemeToggle';
import { useNavigation } from '@/app/hooks/useNavigation';

export default function Navbar() {
  const { title } = useNavigation();
  const menus = navigation.titles.find((menuTitle) => menuTitle.name === title)?.menus ?? navigation.menus;

  return (
    <div className="bg-gray-200">
      <nav className="flex justify-between border-b border-gray-300 px-4 py-2 items-center">
        <div className="flex space-x-4">
          <Link href={'/'}>
            <p className="text-lg text-gray-900 font-bold">logo</p>
          </Link>
          <ul className="flex space-x-4">
            {navigation.titles.map((title) => (
              <li key={title.name}>
                <Link href={`/${title.name}`} className="text-gray-500 hover:text-gray-700">
                  {title.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ThemeToggle />
      </nav>

      {title && (
        <div className="px-4 py-2 text-lg">
          <nav>
            <ul className="flex space-x-4">
              {menus.map((menu) => (
                <li key={menu.name}>
                  <Link href={menu.path} className="text-gray-500 hover:text-gray-700">
                    {menu.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
