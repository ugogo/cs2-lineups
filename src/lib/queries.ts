import { createServerClient } from "@/lib/supabase/server";
import type { Map, Lineup, LineupWithMap } from "@/lib/types";

export {
  getMapsWithCounts,
  getMapBySlug,
  getLineupsForMap,
} from "@/lib/cached-queries";

export async function getLineupById(id: string): Promise<LineupWithMap | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lineups")
    .select("*, maps(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as LineupWithMap | null;
}

export async function getAllLineupsAdmin(): Promise<LineupWithMap[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lineups")
    .select("*, maps(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as LineupWithMap[];
}

export async function getAllMaps(): Promise<Map[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("maps")
    .select("*")
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}
