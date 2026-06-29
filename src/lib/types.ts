export type GrenadeType = "smoke" | "flash" | "molotov" | "he";
export type Side = "T" | "CT";
export type ThrowMethod =
  | "standing"
  | "jump_throw"
  | "run_throw"
  | "lmb"
  | "rmb"
  | "lmb_rmb";

export interface Map {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Lineup {
  id: string;
  map_id: string;
  title: string;
  grenade_type: GrenadeType;
  side: Side;
  throw_method: ThrowMethod;
  position_image_url: string;
  aim_image_url: string;
  notes: string | null;
  site: string | null;
  created_at: string;
}

export interface LineupWithMap extends Lineup {
  maps: Map;
}

export interface LineupFormData {
  map_id: string;
  title: string;
  grenade_type: GrenadeType;
  side: Side;
  throw_method: ThrowMethod;
  notes?: string;
  site?: string;
}
