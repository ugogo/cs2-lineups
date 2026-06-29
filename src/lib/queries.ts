import { createServerClient } from "@/lib/supabase/server";
import type { LineupWithMap } from "@/lib/types";

export {
  getAllMaps,
  getLineupById,
  getLineupsForMap,
  getMapBySlug,
  getMapsWithCounts,
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
