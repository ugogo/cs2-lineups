import { revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  maps: "maps",
  map: (slug: string) => `map-${slug}`,
  lineup: (id: string) => `lineup-${id}`,
  lineups: "lineups",
} as const;

export function revalidateLineupCaches(options?: {
  lineupId?: string;
  mapSlug?: string;
  mapId?: string;
}): void {
  revalidateTag(CACHE_TAGS.lineups, { expire: 0 });
  revalidateTag(CACHE_TAGS.maps, { expire: 0 });

  if (options?.lineupId) {
    revalidateTag(CACHE_TAGS.lineup(options.lineupId), { expire: 0 });
  }
  if (options?.mapSlug) {
    revalidateTag(CACHE_TAGS.map(options.mapSlug), { expire: 0 });
  }
  if (options?.mapId) {
    revalidateTag(`map-id-${options.mapId}`, { expire: 0 });
  }
}
