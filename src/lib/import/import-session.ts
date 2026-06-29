import { rm } from "fs/promises";
import os from "os";
import path from "path";

export const IMPORT_ROOT = path.join(os.tmpdir(), "cs2-lineups-import");

const SESSION_ID_PATTERN = /^[0-9a-f-]{36}$/i;

export function parseSessionId(sessionId: string): string | null {
  return SESSION_ID_PATTERN.test(sessionId) ? sessionId : null;
}

export function getSessionDir(sessionId: string): string | null {
  const id = parseSessionId(sessionId);
  if (!id) return null;

  const sessionDir = path.resolve(IMPORT_ROOT, id);
  if (!sessionDir.startsWith(path.resolve(IMPORT_ROOT) + path.sep)) {
    return null;
  }

  return sessionDir;
}

export function getSessionFramesDir(sessionId: string): string | null {
  const sessionDir = getSessionDir(sessionId);
  if (!sessionDir) return null;
  return path.join(sessionDir, "frames");
}

export function frameUrl(sessionId: string, index: number): string {
  return `/api/import/tweet/frames/${sessionId}/${index}`;
}

export async function cleanupImportSession(sessionId: string): Promise<void> {
  const sessionDir = getSessionDir(sessionId);
  if (!sessionDir) return;
  await rm(sessionDir, { recursive: true, force: true });
}
