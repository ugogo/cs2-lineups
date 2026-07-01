export interface MapTheme {
  /** Tailwind gradient stops for poster / hero backgrounds */
  gradient: string;
  /** Accent used for glow and highlights */
  accent: string;
  /** Optional poster image under public/maps/{slug}.webp */
  imagePath: string;
}

export const MAP_THEMES: Record<string, MapTheme> = {
  mirage: {
    gradient: "from-amber-700/70 via-orange-950/80 to-zinc-950",
    accent: "#d97706",
    imagePath: "/maps/mirage.webp",
  },
  inferno: {
    gradient: "from-red-900/60 via-orange-950/70 to-zinc-950",
    accent: "#dc2626",
    imagePath: "/maps/inferno.webp",
  },
  dust2: {
    gradient: "from-yellow-800/50 via-stone-900/80 to-zinc-950",
    accent: "#ca8a04",
    imagePath: "/maps/dust2.webp",
  },
  nuke: {
    gradient: "from-emerald-900/50 via-slate-900/80 to-zinc-950",
    accent: "#059669",
    imagePath: "/maps/nuke.webp",
  },
  ancient: {
    gradient: "from-green-800/60 via-emerald-950/70 to-zinc-950",
    accent: "#16a34a",
    imagePath: "/maps/ancient.webp",
  },
  anubis: {
    gradient: "from-cyan-800/50 via-indigo-950/70 to-zinc-950",
    accent: "#0891b2",
    imagePath: "/maps/anubis.webp",
  },
  overpass: {
    gradient: "from-teal-800/50 via-slate-900/80 to-zinc-950",
    accent: "#0d9488",
    imagePath: "/maps/overpass.webp",
  },
  cache: {
    gradient: "from-orange-900/50 via-stone-900/80 to-zinc-950",
    accent: "#f97316",
    imagePath: "/maps/cache.webp",
  },
};

const DEFAULT_THEME: MapTheme = {
  gradient: "from-zinc-700/50 via-zinc-900/80 to-zinc-950",
  accent: "#f97316",
  imagePath: "",
};

/** Slugs with a real file at public/maps/{slug}.webp */
export const MAPS_WITH_POSTER_ASSETS = new Set<string>([
  "mirage",
  "inferno",
  "dust2",
  "nuke",
  "ancient",
  "anubis",
  "overpass",
  "cache",
]);

/** Slugs with a map icon at public/maps/logos/{slug}.png */
export const MAPS_WITH_LOGO_ASSETS = new Set<string>([
  "mirage",
  "inferno",
  "dust2",
  "nuke",
  "ancient",
  "anubis",
  "overpass",
  "cache",
]);

export function hasMapPosterAsset(slug: string): boolean {
  return MAPS_WITH_POSTER_ASSETS.has(slug);
}

export function hasMapLogoAsset(slug: string): boolean {
  return MAPS_WITH_LOGO_ASSETS.has(slug);
}

export function getMapLogoPath(slug: string): string {
  return `/maps/logos/${slug}.png`;
}

export function getMapTheme(slug: string): MapTheme {
  return MAP_THEMES[slug] ?? { ...DEFAULT_THEME, imagePath: `/maps/${slug}.webp` };
}
