import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
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
