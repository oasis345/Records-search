/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'ddragon.leagueoflegends.com' }],
  },
  experimental: {
    serverActions: true,
  },
  reactStrictMode: false,
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },

  async rewrites() {
    return [
      process.env.NODE_ENV === 'development'
        ? {
            source: '/api/:path*',
            destination: 'http://localhost:8080/api/:path*',
          }
        : { source: '/api/:path*', destination: 'https://server-oasis345.vercel.app/api/:path*' },
      {
        source: '/lol/riot.txt',
        destination: '/certificate/lol',
      },
      {
        source: '/val/riot.txt',
        destination: '/certificate/val',
      },
    ];
  },
};

module.exports = nextConfig;
