import type { GrenadeType, SourceType, ThrowMethod } from "./types";

export const GRENADE_TYPES: GrenadeType[] = ["smoke", "flash", "molotov", "he"];

export const THROW_METHODS: ThrowMethod[] = [
  "standing",
  "jump_throw",
  "run_throw",
  "lmb",
  "rmb",
  "lmb_rmb",
];

export const GRENADE_LABELS: Record<GrenadeType, string> = {
  smoke: "Smoke",
  flash: "Flash",
  molotov: "Molotov",
  he: "HE",
};

export const THROW_LABELS: Record<ThrowMethod, string> = {
  standing: "Standing throw",
  jump_throw: "Jump throw",
  run_throw: "Run throw",
  lmb: "Left click",
  rmb: "Right click",
  lmb_rmb: "LMB + RMB",
};

export const SOURCE_TYPES = ["none", "twitter"] as const satisfies readonly SourceType[];

export const SOURCE_LABELS: Record<SourceType, string> = {
  none: "Manual",
  twitter: "Twitter",
};

export const SIDE_LABELS = { T: "T Side", CT: "CT Side" } as const;

/** Matches `main` layout: `max-w-7xl` (1280px) with `px-4` horizontal padding. */
export const MAIN_CONTENT_IMAGE_SIZES =
  "(max-width: 1280px) calc(100vw - 2rem), 1248px";

/** Lineup detail main column below the 320px sidebar at `lg`. */
export const LINEUP_DETAIL_IMAGE_SIZES =
  "(max-width: 1024px) 100vw, 888px";

/** Map grid poster cards (`sm:grid-cols-2`). */
export const MAP_CARD_IMAGE_SIZES =
  "(max-width: 640px) 100vw, 50vw";

/** Lineup card thumbnails in responsive grids. */
export const LINEUP_CARD_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

export const ACTIVE_DUTY_MAPS = [
  { name: "Mirage", slug: "mirage", sort_order: 1 },
  { name: "Inferno", slug: "inferno", sort_order: 2 },
  { name: "Dust 2", slug: "dust2", sort_order: 3 },
  { name: "Nuke", slug: "nuke", sort_order: 4 },
  { name: "Ancient", slug: "ancient", sort_order: 5 },
  { name: "Anubis", slug: "anubis", sort_order: 6 },
  { name: "Overpass", slug: "overpass", sort_order: 7 },
  { name: "Train", slug: "train", sort_order: 8 },
] as const;
