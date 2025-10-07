import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Allow builds to continue even if ESLint finds errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  // You can still add other config options below
  /* config options here */
};

export default nextConfig;
