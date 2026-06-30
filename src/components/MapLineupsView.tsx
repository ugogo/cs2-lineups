import { Suspense } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { MapHeroBanner } from "@/components/MapHeroBanner";
import { MapLineupsFilters } from "@/components/MapLineupsFilters";
import { MapLineupsGrid } from "@/components/MapLineupsGrid";
import {
  filterLineups,
  groupLineupsBySite,
  hasActiveFilters,
  parseLineupFilters,
} from "@/lib/lineup-filters";
import type { Lineup } from "@/lib/types";

interface MapLineupsViewProps {
  lineups: Lineup[];
  mapSlug: string;
  mapName: string;
  searchParams: Record<string, string | string[] | undefined>;
}

function MapFiltersFallback() {
  return <div className="h-24 animate-pulse rounded-lg bg-muted/30" />;
}

export function MapLineupsView({
  lineups,
  mapSlug,
  mapName,
  searchParams,
}: MapLineupsViewProps) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }

  const filters = parseLineupFilters(params);
  const sites = [
    ...new Set(lineups.map((l) => l.site).filter(Boolean) as string[]),
  ].sort((a, b) => a.localeCompare(b));
  const filtered = filterLineups(lineups, filters);
  const grouped = filters.site
    ? [{ site: filters.site, lineups: filtered }]
    : groupLineupsBySite(filtered);
  const active = hasActiveFilters(filters);
  const filterQuery = params.toString();

  const resultMessage =
    lineups.length === 0
      ? "No lineups saved yet"
      : active
        ? `${filtered.length} of ${lineups.length} lineup${lineups.length === 1 ? "" : "s"}`
        : `${lineups.length} lineup${lineups.length === 1 ? "" : "s"}`;

  return (
    <div className="space-y-6">
      <MapHeroBanner
        mapSlug={mapSlug}
        mapName={mapName}
        lineupCount={lineups.length}
      />

      {lineups.length > 0 && (
        <Suspense fallback={<MapFiltersFallback />}>
          <MapLineupsFilters mapSlug={mapSlug} sites={sites} />
        </Suspense>
      )}

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="font-mono text-xs text-muted-foreground"
      >
        {resultMessage}
      </p>

      {lineups.length === 0 ? (
        <EmptyState
          title="Empty map"
          description="Head to Admin to add your first lineup."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matches"
          description={
            <>
              No lineups match these filters.{" "}
              <Link href={`/maps/${mapSlug}`} className="text-primary hover:underline">
                Clear filters
              </Link>
            </>
          }
        />
      ) : (
        <MapLineupsGrid
          grouped={grouped}
          mapSlug={mapSlug}
          filterQuery={filterQuery}
          hideSiteHeaders={filters.site !== null}
        />
      )}
    </div>
  );
}
