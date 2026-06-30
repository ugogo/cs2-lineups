import { createServerClient } from "@/lib/supabase/server";
import type { LineupWithMap, SourceType } from "@/lib/types";

export {
  getAllMaps,
  getLineupById,
  getLineupsForMap,
  getMapBySlug,
  getMapsWithCounts,
  getRecentLineups,
  getTotalLineupCount,
} from "@/lib/cached-queries";

export async function getAllLineupsAdmin(): Promise<LineupWithMap[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lineups")
    .select("*, maps(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as LineupWithMap[];
}

export function parseSourceType(value: string | null): SourceType {
  if (value === "twitter") return "twitter";
  return "none";
}
