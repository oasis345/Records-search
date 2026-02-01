'use client';

import Link from 'next/link';
import * as React from 'react';
import { navigation } from './model';
import ThemeToggle from './ThemeToggle';
import { useNavigation } from '@/app/hooks/useNavigation';
import Image from 'next/image';

export default function Navbar() {
  const { currentTitle, currentMenu } = useNavigation();
  const menus = navigation.titles.find((title) => title.name === currentTitle)?.menus ?? navigation.menus;

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border">
      <nav className="container flex justify-between px-4 py-3 items-center">
        <div className="flex items-center space-x-6">
          <Link href={'/'} className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl px-3 py-1 rounded-lg">
              RS.GG
            </div>
          </Link>
          <ul className="flex items-center space-x-1">
            {navigation.titles
              .filter((title) => title.activated)
              .map((title) => (
                <li key={title.name}>
                  <Link
                    href={`/${title.name}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      currentTitle === title.name
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    {title.icon && (
                      <Image
                        src={'/' + title.icon}
                        width={20}
                        height={20}
                        style={{ height: 'auto', width: 'auto' }}
                        alt={title.label}
                      />
                    )}
                    <span className="hidden md:block text-sm font-medium">{title.label}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <ThemeToggle />
      </nav>

      {currentTitle && (
        <div className="container px-4 py-2 border-t border-border/50">
          <nav>
            <ul className="flex items-center space-x-1">
              {menus.map((menu) => (
                <li key={menu.name}>
                  <Link
                    href={menu.href}
                    className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                      currentMenu === menu.name
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
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
