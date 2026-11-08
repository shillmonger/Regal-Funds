import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Allow builds to continue even if ESLint finds errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Allow browser preview from 127.0.0.1
  allowedDevOrigins: ["127.0.0.1"],

  // ✅ Allow external images (Regal FM domain + flags)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.regalfm.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
