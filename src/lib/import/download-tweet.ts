import { mkdir, rm, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { TwitterDL } from "twitter-downloader";

export interface DownloadedTweet {
  tweetText: string;
  videoPath: string;
  tempDir: string;
}

function pickBestVideoUrl(
  videos: { bitrate: number; url: string }[],
): string | null {
  if (videos.length === 0) return null;
  const sorted = [...videos].sort((a, b) => b.bitrate - a.bitrate);
  return sorted[0]?.url ?? null;
}

export async function downloadTweetVideo(url: string): Promise<DownloadedTweet> {
  const result = await TwitterDL(url);

  if (result.status !== "success" || !result.result) {
    throw new Error(result.message ?? "Failed to fetch tweet");
  }

  const videoMedia = result.result.media.find(
    (media) => media.videos && media.videos.length > 0,
  );
  const videoUrl = videoMedia?.videos
    ? pickBestVideoUrl(videoMedia.videos)
    : null;

  if (!videoUrl) {
    throw new Error("No video found in tweet");
  }

  const tempDir = path.join(os.tmpdir(), "cs2-lineups-import", crypto.randomUUID());
  await mkdir(tempDir, { recursive: true });
  const videoPath = path.join(tempDir, "video.mp4");

  const response = await fetch(videoUrl);
  if (!response.ok) {
    await rm(tempDir, { recursive: true, force: true });
    throw new Error("Failed to download tweet video");
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(videoPath, buffer);

  return {
    tweetText: result.result.description,
    videoPath,
    tempDir,
  };
}

export async function cleanupTempDir(tempDir: string): Promise<void> {
  await rm(tempDir, { recursive: true, force: true });
}
