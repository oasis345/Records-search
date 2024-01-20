/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'ddragon.leagueoflegends.com' }],
  },
  experimental: {
    serverActions: true,
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
