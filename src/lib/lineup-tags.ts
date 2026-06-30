import { LINEUP_TAGS } from "@/lib/constants";
import type { Lineup, LineupTag } from "@/lib/types";

export function parseLineupTags(values: string[]): LineupTag[] {
  const allowed = new Set<string>(LINEUP_TAGS);
  return values.filter((value): value is LineupTag => allowed.has(value));
}

export function parseLineupTagsFromForm(formData: FormData): LineupTag[] {
  return parseLineupTags(formData.getAll("tags").map(String));
}

export function slugifyCollectionName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

const RELATED_LIMIT = 4;

export function getRelatedLineups(
  lineup: Lineup,
  mapLineups: Lineup[],
  limit = RELATED_LIMIT,
): Lineup[] {
  return mapLineups
    .filter((candidate) => candidate.id !== lineup.id)
    .map((candidate) => ({
      lineup: candidate,
      score: relatedLineupScore(lineup, candidate),
    }))
    .filter(({ score }) => score > 0)
    .toSorted((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ lineup: related }) => related);
}

function relatedLineupScore(current: Lineup, other: Lineup): number {
  let score = 0;

  if (other.grenade_type === current.grenade_type) {
    score += 3;
  }

  if (current.site && other.site === current.site) {
    score += 4;
  }

  if (other.side === current.side) {
    score += 1;
  }

  for (const tag of current.tags) {
    if (other.tags.includes(tag)) {
      score += 2;
    }
  }

  return score;
}

export function collectTagsFromLineups(lineups: Lineup[]): LineupTag[] {
  const found = new Set<LineupTag>();
  for (const lineup of lineups) {
    for (const tag of lineup.tags) {
      found.add(tag);
    }
  }
  return LINEUP_TAGS.filter((tag) => found.has(tag));
}
