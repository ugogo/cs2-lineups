import { createHash } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "cs2_lineups_admin";

function getExpectedSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHash("sha256").update(`${password}:cs2-lineups`).digest("hex");
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}

export function getSessionTokenFromPassword(password: string): string {
  return createHash("sha256").update(`${password}:cs2-lineups`).digest("hex");
}

export async function isAuthenticated(): Promise<boolean> {
  const expected = getExpectedSessionToken();
  if (!expected) return false;
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === expected;
}

export { SESSION_COOKIE };
