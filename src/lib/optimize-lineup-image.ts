import sharp from "sharp";

/** Matches tweet frame extraction (`extract-frames.ts`). */
export const LINEUP_IMAGE_MAX_WIDTH = 1280;

export const LINEUP_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

const WEBP_QUALITY = 85;

export async function optimizeLineupImage(file: File): Promise<Buffer> {
  const bytes = await file.arrayBuffer();
  if (bytes.byteLength > LINEUP_IMAGE_MAX_BYTES) {
    throw new Error("Image must be smaller than 10 MB");
  }

  if (bytes.byteLength === 0) {
    throw new Error("Image file is empty");
  }

  return sharp(Buffer.from(bytes))
    .rotate()
    .resize({ width: LINEUP_IMAGE_MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();
}
