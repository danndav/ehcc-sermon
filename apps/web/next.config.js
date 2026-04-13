/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.b-cdn.net',
      },
    ],
  },
  // GitHub Pages serves from /ehcc-sermon/ subpath
  basePath: process.env.GITHUB_PAGES === 'true' ? '/ehcc-sermon' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/ehcc-sermon/' : '',
};

module.exports = nextConfig;
