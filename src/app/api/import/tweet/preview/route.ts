import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { checkImportTools, IMPORT_TOOLS_ERROR } from "@/lib/import/check-tools";
import { downloadTweetVideo } from "@/lib/import/download-tweet";
import { extractFrames } from "@/lib/import/extract-frames";
import {
  cleanupImportSession,
  frameUrl,
  getSessionFramesDir,
} from "@/lib/import/import-session";
import { parseTweetText } from "@/lib/import/parse-tweet-text";
import { normalizeTweetUrl, parseTweetUrl } from "@/lib/import/validate-tweet-url";
import path from "path";

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
  if (!url || !parseTweetUrl(url).valid) {
    return NextResponse.json(
      { error: "Invalid tweet URL. Use a link like https://x.com/user/status/123" },
      { status: 400 },
    );
  }

  if (body.previousSessionId) {
    await cleanupImportSession(body.previousSessionId);
  }

  const sourceUrl = normalizeTweetUrl(url);

  try {
    const downloaded = await downloadTweetVideo(sourceUrl);
    const sessionId = path.basename(downloaded.tempDir);
    const framesDir = getSessionFramesDir(sessionId);
    if (!framesDir) {
      throw new Error("Failed to create import session");
    }

    const frames = await extractFrames(downloaded.videoPath, framesDir);
    if (frames.length === 0) {
      await cleanupImportSession(sessionId);
      return NextResponse.json(
        { error: "No frames could be extracted from the video" },
        { status: 422 },
      );
    }

    const suggested = parseTweetText(downloaded.tweetText);

    return NextResponse.json({
      sessionId,
      tweetText: downloaded.tweetText,
      sourceUrl,
      suggested,
      frames: frames.map((frame) => ({
        index: frame.index,
        timestampMs: frame.timestampMs,
        url: frameUrl(sessionId, frame.index),
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to import tweet";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
