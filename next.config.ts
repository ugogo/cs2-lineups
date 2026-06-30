import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "*.supabase.co";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
    minimumCacheTTL: 86_400,
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: [
    "ffmpeg-static",
    "fluent-ffmpeg",
    "ffmpeg-extract-frames",
    "ffmpeg-probe",
    "ffprobe-static",
    "twitter-downloader",
  ],
};

export default nextConfig;
