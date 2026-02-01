import type { Metadata } from 'next';
import RecoilRootWrapper from './RecoilRootWrapper';
import Navbar from './components/navigation/Navbar';
import { ThemeProvider } from '@/components/ui/theme-provider';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import { InterFont } from './utils/font';

export const metadata: Metadata = {
  title: {
    template: `%s - RS.GG`,
    default: `RS.GG 다양한 게임 전적 검색`,
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
            <div className="flex flex-col min-h-screen">
              <header>
                <Navbar />
              </header>

              <main className="flex-1">
                <NextTopLoader showSpinner={false} color="#8b5cf6" />
                {children}
              </main>

              <footer className="border-t border-border bg-muted/30">
                <div className="container py-8 px-4">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg px-2 py-0.5 rounded">
                        RS
                      </div>
                      <span className="font-bold text-foreground">.GG</span>
                      <span className="text-muted-foreground text-sm">- Record Search</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      RS.GG is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      &copy; {new Date().getFullYear()} RS.GG
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </RecoilRootWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
