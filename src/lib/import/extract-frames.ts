import extractFramesLib from "ffmpeg-extract-frames";
import ffmpegStatic from "ffmpeg-static";
import probe from "ffmpeg-probe";
import ffprobeStatic from "ffprobe-static";
import { mkdir, readdir, readFile, rm } from "fs/promises";
import path from "path";

export interface ExtractedFrame {
  index: number;
  timestampMs: number;
  buffer: Buffer;
}

/** Target spacing when the video is short enough to allow it. */
export const TARGET_INTERVAL_MS = 75;
const MAX_FRAMES = 150;
const MIN_FRAMES = 50;

async function getVideoDurationMs(videoPath: string): Promise<number> {
  const previousProbePath = process.env.FFPROBE_PATH;
  process.env.FFPROBE_PATH = ffprobeStatic.path;

  try {
    const info = (await probe(videoPath)) as { duration?: number; format?: { duration?: string } };
    if (typeof info.duration === "number" && info.duration > 0) {
      return info.duration;
    }
    const formatDuration = Number(info.format?.duration);
    if (Number.isFinite(formatDuration) && formatDuration > 0) {
      return Math.round(formatDuration * 1000);
    }
    return MAX_FRAMES * TARGET_INTERVAL_MS;
  } finally {
    if (previousProbePath === undefined) {
      delete process.env.FFPROBE_PATH;
    } else {
      process.env.FFPROBE_PATH = previousProbePath;
    }
  }
}

function buildOffsets(durationMs: number): number[] {
  const safeDuration = Math.max(durationMs, TARGET_INTERVAL_MS);
  const countByInterval = Math.floor(safeDuration / TARGET_INTERVAL_MS) + 1;
  const count = Math.min(MAX_FRAMES, Math.max(MIN_FRAMES, countByInterval));

  if (count <= 1) return [0];

  return Array.from({ length: count }, (_, index) =>
    Math.round((index / (count - 1)) * (safeDuration - 1)),
  );
}

export async function extractFrames(videoPath: string): Promise<ExtractedFrame[]> {
  const durationMs = await getVideoDurationMs(videoPath);
  const offsets = buildOffsets(durationMs);

  const framesDir = path.join(path.dirname(videoPath), "frames");
  await mkdir(framesDir, { recursive: true });

  const outputPattern = path.join(framesDir, "frame-%i.jpg");

  try {
    await extractFramesLib({
      input: videoPath,
      output: outputPattern,
      offsets,
      ffmpegPath: ffmpegStatic ?? undefined,
    });
  } catch (err) {
    await rm(framesDir, { recursive: true, force: true });
    const message = err instanceof Error ? err.message : "Failed to extract video frames";
    throw new Error(message);
  }

  const files = (await readdir(framesDir))
    .filter((name) => name.endsWith(".jpg"))
    .sort();

  const frames: ExtractedFrame[] = [];
  for (let i = 0; i < files.length; i++) {
    const buffer = await readFile(path.join(framesDir, files[i]));
    frames.push({
      index: i,
      timestampMs: offsets[i] ?? i * TARGET_INTERVAL_MS,
      buffer,
    });
  }

  await rm(framesDir, { recursive: true, force: true });
  return frames;
}

export function frameToDataUrl(buffer: Buffer): string {
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}
