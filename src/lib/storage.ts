import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createAdminClient } from "./supabase/admin";

const BUCKET = "lineups";

async function uploadLocally(file: File, prefix: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${prefix}-${crypto.randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function uploadLineupImage(
  file: File,
  prefix: string,
): Promise<string> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return uploadLocally(file, prefix);
  }

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const objectPath = `${prefix}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, file, {
    contentType: file.type,
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

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return;

  const supabase = createAdminClient();
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const objectPath = url.slice(index + marker.length);
  await supabase.storage.from(BUCKET).remove([objectPath]);
}
