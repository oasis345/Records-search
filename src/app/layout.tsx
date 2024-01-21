import type { Metadata } from 'next';
import RecoilRootWrapper from './RecoilRootWrapper';
import Navbar from './components/navigation/Navbar';
import { ThemeProvider } from '@/components/ui/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: '전적검색 사이트',
  description: 'AI를 이용한 전적검색 사이트',
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

              <main className="container flex flex-1 mx-auto px-4 py-8">
                <article className="w-full mx-auto">
                  <section>{children}</section>
                </article>
              </main>

              <footer></footer>
            </div>
          </RecoilRootWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
