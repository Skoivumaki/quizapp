import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

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
