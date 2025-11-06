import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud'],
  },
  // Fix workspace root warning
  outputFileTracingRoot: path.join(__dirname),
  // Exclude docs folder from build (it's from parent workspace)
  outputFileTracingExcludes: {
    '*': [
      'docs/**/*',
      'vibecode/**/*',
      'contracts/**/*',
    ],
  },
  // Optimize build - skip type checking for faster builds
  typescript: {
    ignoreBuildErrors: true, // Skip type checking during build (check separately with tsc)
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build
  },
  // Experimental: Use Turbopack for faster dev (Next.js 15)
  // Uncomment if you want to try:
  // experimental: {
  //   turbo: {
  //     resolveAlias: {
  //     },
  //   },
  // },
};

export default nextConfig;

