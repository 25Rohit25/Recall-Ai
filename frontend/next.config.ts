import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Strict TypeScript enforced for production
  typescript: {
    ignoreBuildErrors: false, 
  },
  eslint: {
    ignoreDuringBuilds: true, // We'll rely on TS for correctness, but skip strict linting in Docker to speed up builds
  }
};

export default nextConfig;
