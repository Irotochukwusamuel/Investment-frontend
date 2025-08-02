import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Static export for cPanel deployment
  output: 'export',
  trailingSlash: true,
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Image optimization for static export
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
