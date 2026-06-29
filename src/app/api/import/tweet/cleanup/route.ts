import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { cleanupImportSession, parseSessionId } from "@/lib/import/import-session";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { sessionId?: string };
  try {
    body = (await request.json()) as { sessionId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sessionId = body.sessionId?.trim();
  if (!sessionId || !parseSessionId(sessionId)) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  await cleanupImportSession(sessionId);
  return NextResponse.json({ ok: true });
}
