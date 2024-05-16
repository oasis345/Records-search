import type { Metadata } from 'next';
import RecoilRootWrapper from './RecoilRootWrapper';
import Navbar from './components/navigation/Navbar';
import { ThemeProvider } from '@/components/ui/theme-provider';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import { InterFont } from './utils/font';

export const metadata: Metadata = {
  title: {
    default: `RS.GG 다양한 게임 전적 검색`,
    template: `%s - RS.GG`,
  },
  description: 'LOL, TFT, PUBG등 다양한 전적을 조회하세요!.',
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={InterFont.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <RecoilRootWrapper>
            <div className="flex flex-col h-screen">
              <header>
                <Navbar></Navbar>
              </header>

              <main>
                <section className="w-full mx-auto">
                  <NextTopLoader showSpinner={false} />
                  {children}
                </section>
              </main>

              <footer></footer>
            </div>
          </RecoilRootWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
