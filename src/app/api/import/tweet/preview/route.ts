import { mkdir } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { checkImportTools, IMPORT_TOOLS_ERROR } from "@/lib/import/check-tools";
import { downloadTweetVideo } from "@/lib/import/download-tweet";
import { extractFrames } from "@/lib/import/extract-frames";
import {
  cleanupImportSession,
  frameUrl,
  getSessionDir,
  getSessionFramesDir,
  IMPORT_ROOT,
} from "@/lib/import/import-session";
import { parseTweetText } from "@/lib/import/parse-tweet-text";
import {
  copyTweetCacheToSession,
  writeTweetCache,
} from "@/lib/import/tweet-cache";
import { normalizeTweetUrl, parseTweetUrl } from "@/lib/import/validate-tweet-url";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tools = await checkImportTools();
  if (!tools.ready) {
    return NextResponse.json({ error: IMPORT_TOOLS_ERROR }, { status: 503 });
  }

  let body: { url?: string; previousSessionId?: string };
  try {
    body = (await request.json()) as { url?: string; previousSessionId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const url = body.url?.trim();
  const parsed = url ? parseTweetUrl(url) : { valid: false as const };
  if (!url || !parsed.valid) {
    return NextResponse.json(
      { error: "Invalid tweet URL. Use a link like https://x.com/user/status/123" },
      { status: 400 },
    );
  }

  if (body.previousSessionId) {
    await cleanupImportSession(body.previousSessionId);
  }

  const sourceUrl = normalizeTweetUrl(url);

  const sessionId = randomUUID();
  const sessionDir = getSessionDir(sessionId);
  if (!sessionDir) {
    return NextResponse.json({ error: "Failed to create import session" }, { status: 500 });
  }

  await mkdir(path.join(IMPORT_ROOT), { recursive: true });
  await mkdir(sessionDir, { recursive: true });

  try {
    const framesDir = getSessionFramesDir(sessionId);
    if (!framesDir) {
      throw new Error("Failed to create import session");
    }

    let tweetText: string;
    let frames;

    const cached = await copyTweetCacheToSession(parsed.statusId, sessionDir);
    if (cached) {
      tweetText = cached.tweetText;
      frames = cached.frames;
    } else {
      const downloaded = await downloadTweetVideo(sourceUrl, sessionDir);
      tweetText = downloaded.tweetText;
      frames = await extractFrames(downloaded.videoPath, framesDir);
      await writeTweetCache(
        parsed.statusId,
        tweetText,
        downloaded.videoPath,
        framesDir,
        frames,
      );
    }

    if (frames.length === 0) {
      await cleanupImportSession(sessionId);
      return NextResponse.json(
        { error: "No frames could be extracted from the video" },
        { status: 422 },
      );
    }

    const suggested = parseTweetText(tweetText);

    return NextResponse.json({
      sessionId,
      tweetText,
      sourceUrl,
      suggested,
      cached: cached !== null,
      frames: frames.map((frame) => ({
        index: frame.index,
        timestampMs: frame.timestampMs,
        url: frameUrl(sessionId, frame.index),
      })),
    });
  } catch (err) {
    await cleanupImportSession(sessionId);
    const message = err instanceof Error ? err.message : "Failed to import tweet";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
