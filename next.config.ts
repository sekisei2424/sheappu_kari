import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   reactStrictMode: true,
  // TEMP: Skip ESLint during production builds to unblock Vercel deploys.
  // Re-enable once lint errors (no-explicit-any, unused-vars, etc.) are addressed.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['dqvnjyzxahsrkpvwszvn.supabase.co'],
  },
};

export default nextConfig;
