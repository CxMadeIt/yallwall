import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  // No assetPrefix - let Next.js use absolute paths
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
