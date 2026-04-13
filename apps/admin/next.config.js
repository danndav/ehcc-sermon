/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.b-cdn.net',
      },
    ],
  },
};

module.exports = nextConfig;
