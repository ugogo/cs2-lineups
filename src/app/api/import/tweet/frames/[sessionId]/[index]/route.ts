import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSessionFramesDir, parseSessionId } from "@/lib/import/import-session";

interface RouteContext {
  params: Promise<{ sessionId: string; index: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId, index: indexParam } = await context.params;
  if (!parseSessionId(sessionId)) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const index = Number(indexParam);
  if (!Number.isInteger(index) || index < 0) {
    return NextResponse.json({ error: "Invalid frame index" }, { status: 400 });
  }

  const framesDir = getSessionFramesDir(sessionId);
  if (!framesDir) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const framePath = path.join(
    framesDir,
    `frame-${String(index + 1).padStart(4, "0")}.jpg`,
  );

  let buffer: Buffer;
  try {
    buffer = await readFile(framePath);
  } catch {
    return NextResponse.json({ error: "Frame not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
