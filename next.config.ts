import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output
  //output: "standalone",
  
  basePath: "/quiz",
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.spotifycdn.com",
      },
      {
        protocol: "https",
        hostname: "**.scdn.co",
      },
    ],
  },
  
  // Add experimental config for server actions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;