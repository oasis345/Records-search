'use client';

import Link from 'next/link';
import * as React from 'react';

export default function Navbar() {
  const navigationGameList: NavigationGameList[] = [
    { image: '', name: '리그오브레전드' },
    { image: '', name: '발로란트' },
  ];

  return (
    <>
      <nav className="flex border-b border-gray-300 py-2">
        <div className="mx-3">LOGO IMAGE</div>
        <div>
          <ul className="flex space-x-4">
            {navigationGameList.map((game) => (
              <li key={game.name}>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  {game.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div></div>
      </nav>

      <nav className="container mx-auto px-4 py-2 text-lg">
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                홈
              </Link>
            </li>
            <li>
              <Link href="/ranking" className="text-gray-500 hover:text-gray-700">
                랭킹
              </Link>
            </li>
          </ul>
        </nav>
      </nav>
    </>
  );
}
