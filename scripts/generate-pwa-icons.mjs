import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#0a0a0a"/>
  <circle cx="256" cy="256" r="168" fill="none" stroke="#e85d04" stroke-width="28"/>
  <circle cx="256" cy="256" r="12" fill="#e85d04"/>
  <line x1="256" y1="256" x2="256" y2="108" stroke="#e85d04" stroke-width="20" stroke-linecap="round"/>
  <line x1="256" y1="256" x2="372" y2="256" stroke="#e85d04" stroke-width="10" stroke-linecap="round"/>
</svg>`;

const iconsDir = path.join(process.cwd(), "public", "icons");
await mkdir(iconsDir, { recursive: true });
await writeFile(path.join(iconsDir, "icon.svg"), svg, "utf8");

for (const size of [192, 512]) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(path.join(iconsDir, `icon-${size}.png`));
}

console.log("Generated PWA icons in public/icons/");
