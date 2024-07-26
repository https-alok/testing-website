/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  pageExtensions: ['page.tsx'],
  images: {
    unoptimized: true,
  },
  experimental: {
    forceSwcTransforms: false,
  },
  webpack: (config, { dev, isServer }) => {
    if (!isServer && dev) {
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                'next/babel',
                '@babel/preset-typescript'
              ],
              plugins: [
                'istanbul'
              ]
            }
          }
        ]
      });
    }
    return config;
  },
};

module.exports = nextConfig;