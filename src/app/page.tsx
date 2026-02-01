import { Card, CardContent } from '@/components/ui/card';
import { NavigationCard } from './components/navigation/NavigationCard';
import { navigation } from './components/navigation/model';

export default function App() {
  const activeGames = navigation.titles.filter((title) => title.activated);
  const comingSoonGames = navigation.titles.filter((title) => !title.activated);

  const activeData = activeGames.map((title) => ({
    ...title,
    imageSrc: `/${title.name}_banner.jpg`,
  }));

  const comingSoonData = comingSoonGames.map((title) => ({
    ...title,
    imageSrc: `/${title.name}_banner.jpg`,
  }));

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 py-20 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            RS.GG
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-2">
            Record Search - 게임 전적 검색 서비스
          </p>
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto">
            LOL, TFT 등 다양한 게임의 전적을 한 곳에서 검색하세요.
            플레이어 통계, 매치 히스토리, 랭킹 정보를 제공합니다.
          </p>
        </div>
      </section>

      {/* Games Section */}
      <section className="container py-10 px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">지원 게임</h2>
          <p className="text-muted-foreground">게임을 선택하여 전적을 검색하세요</p>
        </div>
        <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/30 p-4">
          <CardContent className="p-0">
            <NavigationCard minColWidth={180} data={activeData} />
          </CardContent>
        </Card>
      </section>

      {/* Coming Soon Section */}
      {comingSoonData.length > 0 && (
        <section className="container py-10 px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
            <p className="text-muted-foreground">곧 지원될 게임들입니다</p>
          </div>
          <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/30 p-4 opacity-60">
            <CardContent className="p-0">
              <NavigationCard minColWidth={150} data={comingSoonData} />
            </CardContent>
          </Card>
        </section>
      )}

      {/* Features Section */}
      <section className="container py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-2">주요 기능</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">플레이어 검색</h3>
              <p className="text-sm text-muted-foreground">닉네임으로 플레이어를 검색하고 상세 전적을 확인하세요</p>
            </div>
          </Card>
          <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">상세 통계</h3>
              <p className="text-sm text-muted-foreground">승률, KDA, 챔피언별 통계 등 다양한 데이터 분석</p>
            </div>
          </Card>
          <Card className="border-none shadow-lg bg-gradient-to-br from-pink-500/10 to-pink-600/5 p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">랭킹</h3>
              <p className="text-sm text-muted-foreground">지역별, 티어별 랭킹을 확인하세요</p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
