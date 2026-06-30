import { LineupCard } from "@/components/LineupCard";
import type { SiteGroup } from "@/lib/lineup-filters";

interface MapLineupsGridProps {
  grouped: SiteGroup[];
  mapSlug: string;
  filterQuery: string;
  hideSiteHeaders: boolean;
}

export function MapLineupsGrid({
  grouped,
  mapSlug,
  filterQuery,
  hideSiteHeaders,
}: MapLineupsGridProps) {
  return (
    <div className="space-y-10 scroll-mt-36">
      {grouped.map((group) => (
        <section key={group.site} className="space-y-4">
          {!hideSiteHeaders && grouped.length > 1 && (
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-sm uppercase tracking-[0.15em] text-muted-foreground">
                {group.site}
              </h2>
              <div className="h-px flex-1 bg-border/60" />
              <span className="font-mono text-xs text-muted-foreground">
                {group.lineups.length}
              </span>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {group.lineups.map((lineup) => (
              <div
                key={lineup.id}
                className="[content-visibility:auto] [contain-intrinsic-size:0_280px]"
              >
                <LineupCard
                  lineup={lineup}
                  mapSlug={mapSlug}
                  filterQuery={filterQuery}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
