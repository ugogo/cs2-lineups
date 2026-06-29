"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LineupCard } from "@/components/LineupCard";
import {
  GRENADE_LABELS,
  GRENADE_TYPES,
  SIDE_LABELS,
  THROW_LABELS,
  THROW_METHODS,
} from "@/lib/constants";
import type { GrenadeType, Lineup, Side, ThrowMethod } from "@/lib/types";

interface MapLineupsViewProps {
  lineups: Lineup[];
  mapSlug: string;
  mapName: string;
}

interface ActiveFilters {
  grenade: GrenadeType | null;
  side: Side | null;
  throw: ThrowMethod | null;
  site: string | null;
}

function parseGrenade(value: string | null): GrenadeType | null {
  if (!value) return null;
  return GRENADE_TYPES.includes(value as GrenadeType) ? (value as GrenadeType) : null;
}

function parseSide(value: string | null): Side | null {
  if (value === "T" || value === "CT") return value;
  return null;
}

function parseThrow(value: string | null): ThrowMethod | null {
  if (!value) return null;
  return THROW_METHODS.includes(value as ThrowMethod)
    ? (value as ThrowMethod)
    : null;
}

function filterLineups(lineups: Lineup[], filters: ActiveFilters): Lineup[] {
  return lineups.filter((lineup) => {
    if (filters.grenade && lineup.grenade_type !== filters.grenade) return false;
    if (filters.side && lineup.side !== filters.side) return false;
    if (filters.throw && lineup.throw_method !== filters.throw) return false;
    if (filters.site && lineup.site !== filters.site) return false;
    return true;
  });
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? "bg-orange-500 text-white"
          : "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700 hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}

export function MapLineupsView({
  lineups,
  mapSlug,
  mapName,
}: MapLineupsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: ActiveFilters = {
    grenade: parseGrenade(searchParams.get("grenade")),
    side: parseSide(searchParams.get("side")),
    throw: parseThrow(searchParams.get("throw")),
    site: searchParams.get("site"),
  };

  const sites = useMemo(
    () =>
      [...new Set(lineups.map((l) => l.site).filter(Boolean) as string[])].sort(
        (a, b) => a.localeCompare(b),
      ),
    [lineups],
  );

  const filtered = useMemo(
    () => filterLineups(lineups, filters),
    [lineups, filters],
  );

  const hasActiveFilters =
    filters.grenade !== null ||
    filters.side !== null ||
    filters.throw !== null ||
    filters.site !== null;

  function setFilter(key: keyof ActiveFilters, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.replace(query ? `/maps/${mapSlug}?${query}` : `/maps/${mapSlug}`, {
      scroll: false,
    });
  }

  function toggleFilter(key: keyof ActiveFilters, value: string) {
    const current = filters[key];
    setFilter(key, current === value ? null : value);
  }

  function clearFilters() {
    router.replace(`/maps/${mapSlug}`, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-zinc-500">de_{mapSlug}</p>
        <h1 className="text-3xl font-bold text-zinc-100">{mapName}</h1>
        <p className="mt-2 text-zinc-400">
          {lineups.length === 0
            ? "No lineups saved yet. Add some from the admin panel."
            : hasActiveFilters
              ? `${filtered.length} of ${lineups.length} lineup${lineups.length === 1 ? "" : "s"}`
              : `${lineups.length} lineup${lineups.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {lineups.length > 0 && (
        <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Filters
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-zinc-500 hover:text-orange-400"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-3">
            <FilterGroup label="Grenade">
              {GRENADE_TYPES.map((type) => (
                <FilterChip
                  key={type}
                  label={GRENADE_LABELS[type]}
                  active={filters.grenade === type}
                  onClick={() => toggleFilter("grenade", type)}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Side">
              {(Object.keys(SIDE_LABELS) as Side[]).map((side) => (
                <FilterChip
                  key={side}
                  label={SIDE_LABELS[side]}
                  active={filters.side === side}
                  onClick={() => toggleFilter("side", side)}
                />
              ))}
            </FilterGroup>

            <FilterGroup label="Throw">
              {THROW_METHODS.map((method) => (
                <FilterChip
                  key={method}
                  label={THROW_LABELS[method]}
                  active={filters.throw === method}
                  onClick={() => toggleFilter("throw", method)}
                />
              ))}
            </FilterGroup>

            {sites.length > 0 && (
              <FilterGroup label="Site">
                {sites.map((site) => (
                  <FilterChip
                    key={site}
                    label={site}
                    active={filters.site === site}
                    onClick={() => toggleFilter("site", site)}
                  />
                ))}
              </FilterGroup>
            )}
          </div>
        </div>
      )}

      {lineups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
          Empty map — head to Admin to add your first lineup.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
          No lineups match these filters.{" "}
          <button
            type="button"
            onClick={clearFilters}
            className="text-orange-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((lineup) => (
            <LineupCard key={lineup.id} lineup={lineup} mapSlug={mapSlug} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 text-xs text-zinc-600">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
