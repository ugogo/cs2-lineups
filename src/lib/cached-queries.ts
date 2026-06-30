import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createServerClient } from "@/lib/supabase/server";
import type { Map, Lineup, LineupWithMap } from "@/lib/types";

const THIRTY_DAYS = 30 * 24 * 60 * 60;

function lineupCacheLife(): void {
  cacheLife({ revalidate: THIRTY_DAYS, expire: THIRTY_DAYS });
}

export async function getMapsWithCounts(): Promise<
  (Map & { lineup_count: number })[]
> {
  "use cache";
  cacheTag(CACHE_TAGS.maps, CACHE_TAGS.lineups);
  lineupCacheLife();

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
  "use cache";
  cacheTag(CACHE_TAGS.maps, CACHE_TAGS.map(slug));
  cacheLife("days");

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
  "use cache";
  cacheTag(CACHE_TAGS.lineups, `map-id-${mapId}`);
  lineupCacheLife();

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
  "use cache";
  cacheTag(CACHE_TAGS.lineups, CACHE_TAGS.lineup(id));
  lineupCacheLife();

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lineups")
    .select("*, maps(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as LineupWithMap | null;
}

export async function getAllMaps(): Promise<Map[]> {
  "use cache";
  cacheTag(CACHE_TAGS.maps);
  cacheLife("days");

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("maps")
    .select("*")
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

export async function getRecentLineups(limit = 6): Promise<LineupWithMap[]> {
  "use cache";
  cacheTag(CACHE_TAGS.lineups);
  lineupCacheLife();

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("lineups")
    .select("*, maps(*)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as LineupWithMap[];
}

export async function getTotalLineupCount(): Promise<number> {
  "use cache";
  cacheTag(CACHE_TAGS.lineups);
  lineupCacheLife();

  const supabase = createServerClient();
  const { count, error } = await supabase
    .from("lineups")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count ?? 0;
}
