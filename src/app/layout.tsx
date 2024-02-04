import type { Metadata } from 'next';
import RecoilRootWrapper from './RecoilRootWrapper';
import Navbar from './components/navigation/Navbar';
import { ThemeProvider } from '@/components/ui/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: '전적검색 사이트',
  description: 'Nextjs를 활용한 전적검색 사이트 입니다',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <RecoilRootWrapper>
            <div className="flex flex-col h-screen">
              <header>
                <Navbar></Navbar>
              </header>

              <main>
                <section className="w-full mx-auto">{children}</section>
              </main>

              <footer></footer>
            </div>
          </RecoilRootWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
