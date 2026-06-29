import { execFile } from "child_process";
import ffmpegStatic from "ffmpeg-static";
import probe from "ffmpeg-probe";
import ffprobeStatic from "ffprobe-static";
import { mkdir, readdir, rm } from "fs/promises";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export interface ExtractedFrame {
  index: number;
  timestampMs: number;
}

/** Target spacing when the video is short enough to allow it. */
export const TARGET_INTERVAL_MS = 150;
const MAX_FRAMES = 40;
const MIN_FRAMES = 20;
const MAX_FRAME_WIDTH = 1280;
const JPEG_QUALITY = 3;

async function getVideoDurationMs(videoPath: string): Promise<number> {
  const previousProbePath = process.env.FFPROBE_PATH;
  process.env.FFPROBE_PATH = ffprobeStatic.path;

  try {
    const info = (await probe(videoPath)) as {
      duration?: number;
      format?: { duration?: string };
    };
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

function buildFramePlan(durationMs: number): { count: number; timestampsMs: number[] } {
  const safeDuration = Math.max(durationMs, TARGET_INTERVAL_MS);
  const countByInterval = Math.floor(safeDuration / TARGET_INTERVAL_MS) + 1;
  const count = Math.min(MAX_FRAMES, Math.max(MIN_FRAMES, countByInterval));

  if (count <= 1) {
    return { count: 1, timestampsMs: [0] };
  }

  const timestampsMs = Array.from({ length: count }, (_, index) =>
    Math.round((index / (count - 1)) * (safeDuration - 1)),
  );

  return { count, timestampsMs };
}

export async function extractFrames(
  videoPath: string,
  framesDir: string,
): Promise<ExtractedFrame[]> {
  if (!ffmpegStatic) {
    throw new Error("ffmpeg-static is not available");
  }

  const durationMs = await getVideoDurationMs(videoPath);
  const { count, timestampsMs } = buildFramePlan(durationMs);
  const durationSec = Math.max(durationMs / 1000, 0.001);
  const fps = count <= 1 ? 1 : (count - 1) / durationSec;

  await mkdir(framesDir, { recursive: true });

  const outputPattern = path.join(framesDir, "frame-%04d.jpg");
  const vf = `fps=${fps},scale='min(${MAX_FRAME_WIDTH},iw)':-2:flags=lanczos`;

  try {
    await execFileAsync(ffmpegStatic, [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      videoPath,
      "-vf",
      vf,
      "-frames:v",
      String(count),
      "-q:v",
      String(JPEG_QUALITY),
      outputPattern,
    ]);
  } catch (err) {
    await rm(framesDir, { recursive: true, force: true });
    const message =
      err instanceof Error ? err.message : "Failed to extract video frames";
    throw new Error(message);
  }

  const files = (await readdir(framesDir))
    .filter((name) => name.endsWith(".jpg"))
    .sort();

  return files.map((_, index) => ({
    index,
    timestampMs: timestampsMs[index] ?? index * TARGET_INTERVAL_MS,
  }));
}
