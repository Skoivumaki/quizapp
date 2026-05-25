import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
