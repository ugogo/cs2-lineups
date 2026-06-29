import { createServerClient } from "@/lib/supabase/server";
import type { Map, Lineup, LineupWithMap } from "@/lib/types";

export async function getMapsWithCounts(): Promise<
  (Map & { lineup_count: number })[]
> {
  const supabase = createServerClient();

  const { data: maps, error: mapsError } = await supabase
    .from("maps")
    .select("*")
    .order("sort_order");

  if (mapsError) throw mapsError;

  const { data: lineups, error: lineupsError } = await supabase
    .from("lineups")
    .select("map_id");

  if (lineupsError) throw lineupsError;

  const counts = new globalThis.Map<string, number>();
  for (const lineup of lineups ?? []) {
    counts.set(lineup.map_id, (counts.get(lineup.map_id) ?? 0) + 1);
  }

  return (maps ?? []).map((map) => ({
    ...map,
    lineup_count: counts.get(map.id) ?? 0,
  }));
}

export async function getMapBySlug(slug: string): Promise<Map | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("maps")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getLineupsForMap(mapId: string): Promise<Lineup[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lineups")
    .select("*")
    .eq("map_id", mapId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

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
