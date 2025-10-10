import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Allow builds to continue even if ESLint finds errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Allow external images (Regal FM domain)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.regalfm.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
