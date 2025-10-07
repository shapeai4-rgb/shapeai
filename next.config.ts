import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ★★★ НАЧАЛО НОВОГО БЛОКА ★★★
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ★★★ КОНЕЦ НОВОГО БЛОКА ★★★
};

export default nextConfig;