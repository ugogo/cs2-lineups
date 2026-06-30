import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { optimizeLineupImage } from "@/lib/optimize-lineup-image";
import { createAdminClient } from "./supabase/admin";

const BUCKET = "lineups";
const WEBP_CONTENT_TYPE = "image/webp";

async function uploadLocally(buffer: Buffer, prefix: string): Promise<string> {
  const filename = `${prefix}-${crypto.randomUUID()}.webp`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function uploadLineupImage(
  file: File,
  prefix: string,
): Promise<string> {
  const optimized = await optimizeLineupImage(file);

  if (!process.env.SUPABASE_SECRET_KEY) {
    return uploadLocally(optimized, prefix);
  }

  const supabase = createAdminClient();
  const objectPath = `${prefix}/${crypto.randomUUID()}.webp`;

  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, optimized, {
    contentType: WEBP_CONTENT_TYPE,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

export async function deleteLineupImage(url: string): Promise<void> {
  if (url.startsWith("/uploads/")) {
    const { unlink } = await import("fs/promises");
    const filePath = path.join(process.cwd(), "public", url);
    try {
      await unlink(filePath);
    } catch {
      // file may already be gone
    }
    return;
  }

  if (!process.env.SUPABASE_SECRET_KEY) return;

  const supabase = createAdminClient();
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const objectPath = url.slice(index + marker.length);
  await supabase.storage.from(BUCKET).remove([objectPath]);
}
