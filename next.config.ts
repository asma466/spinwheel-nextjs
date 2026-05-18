import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Experimental features for performance if needed
  // experimental: {
  //   optimizePackageImports: ['lucide-react', 'date-fns'],
  // },
};

export default nextConfig;
