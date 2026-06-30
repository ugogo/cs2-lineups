import Link from "next/link";
import { LineupCard } from "@/components/LineupCard";
import { filtersToSearchParams, type LineupFilters } from "@/lib/lineup-filters";
import type { Lineup, LineupWithMap } from "@/lib/types";

interface RelatedLineupsProps {
  lineups: Lineup[];
  mapSlug: string;
  filters: LineupFilters;
}

export function RelatedLineups({
  lineups,
  mapSlug,
  filters,
}: RelatedLineupsProps) {
  if (lineups.length === 0) {
    return null;
  }

  const filterQuery = filtersToSearchParams(filters).toString();

  return (
    <section className="space-y-4 border-t border-border/50 pt-8">
      <div className="space-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          Related
        </p>
        <h2 className="font-heading text-xl uppercase tracking-wide">
          More like this
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {lineups.map((lineup) => (
          <LineupCard
            key={lineup.id}
            lineup={lineup}
            mapSlug={mapSlug}
            filterQuery={filterQuery}
          />
        ))}
      </div>
    </section>
  );
}

interface CollectionLineupsGridProps {
  lineups: LineupWithMap[];
}

export function CollectionLineupsGrid({ lineups }: CollectionLineupsGridProps) {
  if (lineups.length === 0) {
    return (
      <p className="font-mono text-sm text-muted-foreground">
        No lineups in this pack yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lineups.map((lineup) => (
        <LineupCard
          key={lineup.id}
          lineup={lineup}
          mapSlug={lineup.maps.slug}
          mapName={lineup.maps.name}
        />
      ))}
    </div>
  );
}

interface CollectionCardProps {
  name: string;
  slug: string;
  description: string | null;
  lineupCount: number;
}

export function CollectionCard({
  name,
  slug,
  description,
  lineupCount,
}: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${slug}`}
      className="group flex flex-col rounded-xl border border-border/60 bg-card/50 p-5 transition hover:border-primary/30 hover:bg-card"
    >
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
        Pack
      </p>
      <h3 className="mt-2 font-heading text-xl uppercase tracking-wide text-foreground group-hover:text-primary">
        {name}
      </h3>
      {description && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <p className="mt-4 font-mono text-xs text-muted-foreground">
        {lineupCount} lineup{lineupCount === 1 ? "" : "s"}
      </p>
    </Link>
  );
}
