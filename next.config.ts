import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.MERCHANTLENS_TARGET === 'cloudrun' ? {output:'standalone' as const} : {}),
};

export default nextConfig;
