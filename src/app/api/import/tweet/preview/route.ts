import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { checkImportTools, IMPORT_TOOLS_ERROR } from "@/lib/import/check-tools";
import {
  cleanupTempDir,
  downloadTweetVideo,
} from "@/lib/import/download-tweet";
import { extractFrames, frameToDataUrl } from "@/lib/import/extract-frames";
import { parseTweetText } from "@/lib/import/parse-tweet-text";
import { normalizeTweetUrl, parseTweetUrl } from "@/lib/import/validate-tweet-url";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tools = await checkImportTools();
  if (!tools.ready) {
    return NextResponse.json({ error: IMPORT_TOOLS_ERROR }, { status: 503 });
  }

  let body: { url?: string };
  try {
    body = (await request.json()) as { url?: string };
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

  const sourceUrl = normalizeTweetUrl(url);
  let tempDir: string | null = null;

  try {
    const downloaded = await downloadTweetVideo(sourceUrl);
    tempDir = downloaded.tempDir;

    const frames = await extractFrames(downloaded.videoPath);
    if (frames.length === 0) {
      return NextResponse.json(
        { error: "No frames could be extracted from the video" },
        { status: 422 },
      );
    }

    const suggested = parseTweetText(downloaded.tweetText);

    return NextResponse.json({
      tweetText: downloaded.tweetText,
      sourceUrl,
      suggested,
      frames: frames.map((frame) => ({
        index: frame.index,
        timestampMs: frame.timestampMs,
        dataUrl: frameToDataUrl(frame.buffer),
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to import tweet";
    return NextResponse.json({ error: message }, { status: 500 });
  } finally {
    if (tempDir) {
      await cleanupTempDir(tempDir);
    }
  }
}
