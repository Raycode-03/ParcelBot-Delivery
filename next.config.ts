import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors during builds
  },
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maps.geoapify.com',
      },
    ],
  },
};

export default nextConfig;
