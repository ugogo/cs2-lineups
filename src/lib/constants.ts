import type { GrenadeType, ThrowMethod } from "./types";

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

export const SIDE_LABELS = { T: "T Side", CT: "CT Side" } as const;

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
