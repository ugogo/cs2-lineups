import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { parseLineupTags } from "@/lib/lineup-tags";
import { createServerClient } from "@/lib/supabase/server";
import type {
  Collection,
  CollectionSummary,
  CollectionWithLineups,
  Map,
  Lineup,
  LineupWithMap,
} from "@/lib/types";

const THIRTY_DAYS = 30 * 24 * 60 * 60;

function lineupCacheLife(): void {
  cacheLife({ revalidate: THIRTY_DAYS, expire: THIRTY_DAYS });
}

function normalizeLineup<T extends Lineup>(lineup: T): T {
  return {
    ...lineup,
    tags: parseLineupTags(lineup.tags ?? []),
  };
}

export async function getMapsWithCounts(): Promise<
  (Map & { lineup_count: number })[]
> {
  "use cache";
  cacheTag(CACHE_TAGS.maps, CACHE_TAGS.lineups);
  lineupCacheLife();

  const supabase = createServerClient();

  const [
    { data: maps, error: mapsError },
    { data: lineups, error: lineupsError },
  ] = await Promise.all([
    supabase.from("maps").select("*").order("sort_order"),
    supabase.from("lineups").select("map_id"),
  ]);

  if (mapsError) throw mapsError;
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

export async function getMapWithLineupsBySlug(
  slug: string,
): Promise<{ map: Map; lineups: Lineup[] } | null> {
  "use cache";
  cacheTag(CACHE_TAGS.maps, CACHE_TAGS.map(slug), CACHE_TAGS.lineups);
  lineupCacheLife();

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("maps")
    .select("*, lineups(*)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { lineups: nestedLineups, ...mapRow } = data;
  const lineups = [...(nestedLineups ?? [])].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return { map: mapRow as Map, lineups: (lineups as Lineup[]).map(normalizeLineup) };
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
  return (data ?? []).map(normalizeLineup);
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
  if (!data) return null;
  return normalizeLineup(data as LineupWithMap);
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
  return (data ?? []).map((lineup) => normalizeLineup(lineup as LineupWithMap));
}

export async function getCollectionsWithCounts(): Promise<CollectionSummary[]> {
  "use cache";
  cacheTag(CACHE_TAGS.collections);
  lineupCacheLife();

  const supabase = createServerClient();
  const [
    { data: collections, error: collectionsError },
    { data: memberships, error: membershipsError },
  ] = await Promise.all([
    supabase.from("collections").select("*").order("created_at", { ascending: false }),
    supabase.from("collection_lineups").select("collection_id"),
  ]);

  if (collectionsError) throw collectionsError;
  if (membershipsError) throw membershipsError;

  const counts = new globalThis.Map<string, number>();
  for (const row of memberships ?? []) {
    counts.set(
      row.collection_id,
      (counts.get(row.collection_id) ?? 0) + 1,
    );
  }

  return (collections ?? []).map((collection) => ({
    ...(collection as Collection),
    lineup_count: counts.get(collection.id) ?? 0,
  }));
}

export async function getCollectionBySlug(
  slug: string,
): Promise<CollectionWithLineups | null> {
  "use cache";
  cacheTag(CACHE_TAGS.collections, CACHE_TAGS.collection(slug), CACHE_TAGS.lineups);
  lineupCacheLife();

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select(
      "*, collection_lineups(sort_order, lineups(*, maps(*)))",
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { collection_lineups: nestedMemberships, ...collectionRow } = data;
  const lineups = [...(nestedMemberships ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((membership) => normalizeLineup(membership.lineups as LineupWithMap))
    .filter(Boolean);

  return {
    ...(collectionRow as Collection),
    lineups,
  };
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
