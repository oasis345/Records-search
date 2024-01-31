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
      {
        source: '/riot.txt',
        destination: '/api',
      },
    ];
  },
};

module.exports = nextConfig;
