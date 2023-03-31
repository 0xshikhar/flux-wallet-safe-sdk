const nextConfig = {
  env: {
    NETWORK: process.env.NETWORK,
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    externalDir: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    config.resolve.fallback = {
      fs: false,
      path: false
    };
    return config;
  },
};

/** @type {import('next').NextConfig} */
module.exports = nextConfig;
