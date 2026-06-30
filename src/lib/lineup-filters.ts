import {
  GRENADE_TYPES,
  LINEUP_TAGS,
  THROW_METHODS,
} from "@/lib/constants";
import type { GrenadeType, Lineup, LineupTag, Side, ThrowMethod } from "@/lib/types";

export interface LineupFilters {
  grenade: GrenadeType | null;
  side: Side | null;
  throw: ThrowMethod | null;
  site: string | null;
  tag: LineupTag | null;
}

export interface SiteGroup {
  site: string;
  lineups: Lineup[];
}

export function parseGrenadeFilter(value: string | null): GrenadeType | null {
  if (!value) return null;
  return GRENADE_TYPES.includes(value as GrenadeType)
    ? (value as GrenadeType)
    : null;
}

export function parseSideFilter(value: string | null): Side | null {
  if (value === "T" || value === "CT") return value;
  return null;
}

export function parseThrowFilter(value: string | null): ThrowMethod | null {
  if (!value) return null;
  return THROW_METHODS.includes(value as ThrowMethod)
    ? (value as ThrowMethod)
    : null;
}

export function parseTagFilter(value: string | null): LineupTag | null {
  if (!value) return null;
  return LINEUP_TAGS.includes(value as LineupTag)
    ? (value as LineupTag)
    : null;
}

export function parseLineupFilters(
  params: URLSearchParams | Record<string, string | null | undefined>,
): LineupFilters {
  const get = (key: string): string | null => {
    if (params instanceof URLSearchParams) {
      return params.get(key);
    }
    const value = params[key];
    return value ?? null;
  };

  return {
    grenade: parseGrenadeFilter(get("grenade")),
    side: parseSideFilter(get("side")),
    throw: parseThrowFilter(get("throw")),
    site: get("site"),
    tag: parseTagFilter(get("tag")),
  };
}

export function filtersToSearchParams(filters: LineupFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.grenade) params.set("grenade", filters.grenade);
  if (filters.side) params.set("side", filters.side);
  if (filters.throw) params.set("throw", filters.throw);
  if (filters.site) params.set("site", filters.site);
  if (filters.tag) params.set("tag", filters.tag);
  return params;
}

export function lineupDetailHref(
  id: string,
  filters: LineupFilters,
): string {
  const params = filtersToSearchParams(filters);
  const query = params.toString();
  return query ? `/lineups/${id}?${query}` : `/lineups/${id}`;
}

export function filterLineups(
  lineups: Lineup[],
  filters: LineupFilters,
): Lineup[] {
  return lineups.filter((lineup) => {
    if (filters.grenade && lineup.grenade_type !== filters.grenade) {
      return false;
    }
    if (filters.side && lineup.side !== filters.side) return false;
    if (filters.throw && lineup.throw_method !== filters.throw) return false;
    if (filters.site && lineup.site !== filters.site) return false;
    if (filters.tag && !lineup.tags.includes(filters.tag)) return false;
    return true;
  });
}

export function hasActiveFilters(filters: LineupFilters): boolean {
  return (
    filters.grenade !== null ||
    filters.side !== null ||
    filters.throw !== null ||
    filters.site !== null ||
    filters.tag !== null
  );
}

export function groupLineupsBySite(lineups: Lineup[]): SiteGroup[] {
  const groups = new globalThis.Map<string, Lineup[]>();

  for (const lineup of lineups) {
    const site = lineup.site?.trim() || "Other";
    const bucket = groups.get(site) ?? [];
    bucket.push(lineup);
    groups.set(site, bucket);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      return a.localeCompare(b);
    })
    .map(([site, siteLineups]) => ({ site, lineups: siteLineups }));
}

export function orderLineupsForNavigation(lineups: Lineup[]): Lineup[] {
  if (lineups.length === 0) return lineups;

  const hasSites = lineups.some((lineup) => lineup.site?.trim());
  if (!hasSites) return lineups;

  return groupLineupsBySite(lineups).flatMap((group) => group.lineups);
}

export function getAdjacentLineupIds(
  lineups: Lineup[],
  currentId: string,
): { prevId: string | null; nextId: string | null } {
  const ordered = orderLineupsForNavigation(lineups);
  const index = ordered.findIndex((lineup) => lineup.id === currentId);
  if (index === -1) {
    return { prevId: null, nextId: null };
  }

  return {
    prevId: index > 0 ? ordered[index - 1].id : null,
    nextId: index < ordered.length - 1 ? ordered[index + 1].id : null,
  };
}
