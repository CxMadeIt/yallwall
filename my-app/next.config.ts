import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  // Remove assetPrefix to use absolute paths
  // assetPrefix: '.',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
