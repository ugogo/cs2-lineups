import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Posters: ghostcap-gaming/cs2-map-images
 * Logos: MurkyYT/cs2-map-icons (extracted from CS2 game files)
 */
const POSTER_BASE_URL =
  "https://raw.githubusercontent.com/ghostcap-gaming/cs2-map-images/main/cs2";
const THUMB_BASE_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/thumbs";
const LOGO_BASE_URL =
  "https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images";

/** Alternate poster sources (official CS2 loading-screen thumbnails). */
const POSTER_OVERRIDES = {
  ancient: `${THUMB_BASE_URL}/de_ancient_2_png.png`,
  cache: `${THUMB_BASE_URL}/de_cache_3_png.png`,
};

function getPosterUrl(slug) {
  return POSTER_OVERRIDES[slug] ?? `${POSTER_BASE_URL}/de_${slug}.png`;
}

const MAPS = [
  "mirage",
  "inferno",
  "dust2",
  "nuke",
  "ancient",
  "anubis",
  "overpass",
  "cache",
];

const POSTER_WIDTH = 1280;
const POSTER_HEIGHT = 800;

const posterDir = path.join(process.cwd(), "public", "maps");
const logoDir = path.join(posterDir, "logos");
await mkdir(posterDir, { recursive: true });
await mkdir(logoDir, { recursive: true });

for (const slug of MAPS) {
  const posterUrl = getPosterUrl(slug);
  const posterResponse = await fetch(posterUrl);
  if (!posterResponse.ok) {
    throw new Error(`Failed to fetch ${posterUrl}: ${posterResponse.status}`);
  }

  const posterSource = Buffer.from(await posterResponse.arrayBuffer());
  const webp = await sharp(posterSource)
    .resize({
      width: POSTER_WIDTH,
      height: POSTER_HEIGHT,
      fit: "cover",
      position: "centre",
    })
    .webp({ quality: 85 })
    .toBuffer();

  await writeFile(path.join(posterDir, `${slug}.webp`), webp);
  console.log(`Saved ${slug}.webp`);

  const logoUrl = `${LOGO_BASE_URL}/de_${slug}.png`;
  const logoResponse = await fetch(logoUrl);
  if (!logoResponse.ok) {
    throw new Error(`Failed to fetch ${logoUrl}: ${logoResponse.status}`);
  }

  const logoSource = Buffer.from(await logoResponse.arrayBuffer());
  await writeFile(path.join(logoDir, `${slug}.png`), logoSource);
  console.log(`Saved logos/${slug}.png`);
}

console.log(`Done — ${MAPS.length} posters and logos in public/maps/`);
