import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['1e33a9b747eed9.lhr.life', '7486c6c038fe6e.lhr.life'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
