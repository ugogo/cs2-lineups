import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "../public/uploads/dust2");
fs.mkdirSync(dir, { recursive: true });

const images = [
  {
    file: "long-doors-position.jpg",
    title: "Long Doors Smoke",
    subtitle: "1. Stand here - T Spawn",
    detail: "Stand in the back-left corner of T spawn",
  },
  {
    file: "long-doors-aim.jpg",
    title: "Long Doors Smoke",
    subtitle: "2. Aim here",
    detail: "Aim at the top of the Long Doors arch",
  },
  {
    file: "xbox-position.jpg",
    title: "Xbox Smoke",
    subtitle: "1. Stand here - Upper Tunnels",
    detail: "Stand on the ramp at top of Upper Tunnels",
  },
  {
    file: "xbox-aim.jpg",
    title: "Xbox Smoke",
    subtitle: "2. Aim here",
    detail: "Aim at the left edge of the Mid garage opening",
  },
  {
    file: "ct-position.jpg",
    title: "CT Smoke (B Execute)",
    subtitle: "1. Stand here - Upper Tunnels",
    detail: "Stand near the B tunnel entrance",
  },
  {
    file: "ct-aim.jpg",
    title: "CT Smoke (B Execute)",
    subtitle: "2. Aim here",
    detail: "Aim above the CT spawn double doors",
  },
];

function buildSvg(title, subtitle, detail, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <rect width="1280" height="720" fill="#1a1510"/>
  <rect x="40" y="40" width="1200" height="640" fill="#2a2218" stroke="${accent}" stroke-width="3"/>
  <text x="640" y="120" fill="#f4e4c1" font-family="Arial,sans-serif" font-size="42" font-weight="bold" text-anchor="middle">${title}</text>
  <text x="640" y="180" fill="${accent}" font-family="Arial,sans-serif" font-size="28" text-anchor="middle">${subtitle}</text>
  <circle cx="640" cy="360" r="40" fill="none" stroke="#22c55e" stroke-width="4"/>
  <text x="640" y="480" fill="#a8a29e" font-family="Arial,sans-serif" font-size="22" text-anchor="middle">${detail}</text>
</svg>`;
}

for (const image of images) {
  const accent = image.subtitle.startsWith("2.") ? "#ef4444" : "#c45c26";
  const svg = buildSvg(image.title, image.subtitle, image.detail, accent);
  const outPath = path.join(dir, image.file);
  await sharp(Buffer.from(svg)).jpeg({ quality: 92 }).toFile(outPath);
  console.log(`Created ${image.file} (${fs.statSync(outPath).size} bytes)`);
}
