import { Inter, Gochi_Hand } from 'next/font/google';

export const InterFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const GochiHandFont = Gochi_Hand({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-gochi-hand',
});
