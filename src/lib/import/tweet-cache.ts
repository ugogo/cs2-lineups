import { cp, mkdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";
import type { ExtractedFrame } from "@/lib/import/extract-frames";
import { IMPORT_ROOT } from "@/lib/import/import-session";

const TWEET_CACHE_ROOT = path.join(IMPORT_ROOT, "tweet-cache");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const STATUS_ID_PATTERN = /^\d+$/;

interface TweetCacheMeta {
  cachedAt: string;
  tweetText: string;
  frames: ExtractedFrame[];
}

export function getTweetCacheDir(statusId: string): string | null {
  if (!STATUS_ID_PATTERN.test(statusId)) return null;
  return path.join(TWEET_CACHE_ROOT, statusId);
}

async function isFresh(cacheDir: string): Promise<boolean> {
  try {
    const metaPath = path.join(cacheDir, "meta.json");
    const metaStat = await stat(metaPath);
    return Date.now() - metaStat.mtimeMs < CACHE_TTL_MS;
  } catch {
    return false;
  }
}

export async function readTweetCache(
  statusId: string,
): Promise<TweetCacheMeta | null> {
  const cacheDir = getTweetCacheDir(statusId);
  if (!cacheDir || !(await isFresh(cacheDir))) return null;

  try {
    const raw = await readFile(path.join(cacheDir, "meta.json"), "utf8");
    const meta = JSON.parse(raw) as TweetCacheMeta;
    const videoPath = path.join(cacheDir, "video.mp4");
    await stat(videoPath);
    await stat(path.join(cacheDir, "frames"));
    return meta;
  } catch {
    return null;
  }
}

export async function writeTweetCache(
  statusId: string,
  tweetText: string,
  videoPath: string,
  framesDir: string,
  frames: ExtractedFrame[],
): Promise<void> {
  const cacheDir = getTweetCacheDir(statusId);
  if (!cacheDir) return;

  await mkdir(path.join(cacheDir, "frames"), { recursive: true });

  await cp(videoPath, path.join(cacheDir, "video.mp4"));
  await cp(framesDir, path.join(cacheDir, "frames"), { recursive: true });

  const meta: TweetCacheMeta = {
    cachedAt: new Date().toISOString(),
    tweetText,
    frames,
  };
  await writeFile(
    path.join(cacheDir, "meta.json"),
    JSON.stringify(meta),
    "utf8",
  );
}

export async function copyTweetCacheToSession(
  statusId: string,
  sessionDir: string,
): Promise<TweetCacheMeta | null> {
  const cacheDir = getTweetCacheDir(statusId);
  if (!cacheDir || !(await isFresh(cacheDir))) return null;

  try {
    const raw = await readFile(path.join(cacheDir, "meta.json"), "utf8");
    const meta = JSON.parse(raw) as TweetCacheMeta;

    await mkdir(path.join(sessionDir, "frames"), { recursive: true });
    await cp(path.join(cacheDir, "video.mp4"), path.join(sessionDir, "video.mp4"));
    await cp(path.join(cacheDir, "frames"), path.join(sessionDir, "frames"), {
      recursive: true,
    });

    return meta;
  } catch {
    return null;
  }
}
