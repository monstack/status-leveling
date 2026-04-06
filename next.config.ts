import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @opennextjs/cloudflare compatibility
  experimental: {
    // Enable server actions
  },
};

export default nextConfig;
