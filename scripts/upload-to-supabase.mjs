import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../public/uploads/dust2");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("Missing Supabase env vars");
}

const supabase = createClient(url, key);
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".jpg"));

for (const file of files) {
  const filePath = path.join(dir, file);
  const storagePath = `dust2/${file}`;
  const buffer = fs.readFileSync(filePath);

  const { error: uploadError } = await supabase.storage
    .from("lineups")
    .upload(storagePath, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload failed for ${file}: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("lineups").getPublicUrl(storagePath);
  console.log(`${file} -> ${data.publicUrl}`);
}
