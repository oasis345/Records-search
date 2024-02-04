/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'ddragon.leagueoflegends.com' }],
  },
  reactStrictMode: false,
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },

  async rewrites() {
    const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https';
    return [
      {
        source: '/api/:path*',
        destination: `${protocol}://127.0.0.1:3000/api/:path*`,
      },
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
