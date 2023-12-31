import type { Metadata } from 'next';
import RecoilRootWrapper from './RecoilRootWrapper';
import Navbar from './components/shared/Navigation/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: '전적검색 사이트',
  description: 'AI를 이용한 전적검색 사이트',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-white dark:bg-black">
        <div className="flex flex-col h-screen">
          <header className="bg-gray-200">
            <Navbar></Navbar>
          </header>

          <main className="container flex flex-1 mx-auto px-4 py-8">
            <article className="w-full mx-auto my-auto">
              <section>
                <RecoilRootWrapper>{children}</RecoilRootWrapper>
              </section>
            </article>
          </main>

          <footer>
            <div className="container mx-auto px-4">
              <p className="text-center text-gray-500">© 2023 My Blog. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
