import { createServerClient } from "@/lib/supabase/server";
import type { Collection, CollectionSummary, LineupWithMap, SourceType } from "@/lib/types";

export {
  getAllMaps,
  getCollectionBySlug,
  getCollectionsWithCounts,
  getLineupById,
  getLineupsForMap,
  getMapBySlug,
  getMapWithLineupsBySlug,
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

export async function getAllCollectionsAdmin(): Promise<CollectionSummary[]> {
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

export async function getCollectionAdminById(
  id: string,
): Promise<(Collection & { lineup_ids: string[] }) | null> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("collections")
    .select("*, collection_lineups(lineup_id, sort_order)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { collection_lineups: memberships, ...collection } = data;
  const lineup_ids = [...(memberships ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((membership) => membership.lineup_id);

  return {
    ...(collection as Collection),
    lineup_ids,
  };
}

export function parseSourceType(value: string | null): SourceType {
  if (value === "twitter") return "twitter";
  return "none";
}
