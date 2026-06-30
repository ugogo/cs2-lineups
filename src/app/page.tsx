import Link from "next/link";
import { MapGrid } from "@/components/MapGrid";
import { CollectionCard } from "@/components/Collections";
import { FeaturedLineupBanner } from "@/components/FeaturedLineupBanner";
import { RecentLineupsStrip } from "@/components/RecentLineupsStrip";
import { getCollectionsWithCounts, getMapsWithCounts, getRecentLineups } from "@/lib/queries";
import { ACTIVE_DUTY_MAPS } from "@/lib/constants";

export default async function HomePage() {
  const [maps, recentLineups, collections] = await Promise.all([
    getMapsWithCounts(),
    getRecentLineups(6),
    getCollectionsWithCounts(),
  ]);

  const totalLineups = maps.reduce((sum, map) => sum + map.lineup_count, 0);
  const featured = recentLineups[0] ?? null;
  const stripLineups = featured ? recentLineups.slice(1) : recentLineups;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          Briefing room
        </p>
        <h1 className="font-heading text-3xl uppercase tracking-wider sm:text-4xl">
          Pick a map
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          Active Duty · {ACTIVE_DUTY_MAPS.length} maps · {totalLineups} lineup
          {totalLineups === 1 ? "" : "s"}
        </p>
      </header>

      {featured && <FeaturedLineupBanner lineup={featured} />}

      <MapGrid maps={maps} />

      {collections.length > 0 && (
        <>
          <div className="h-px bg-border/50" aria-hidden="true" />
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Practice packs
                </p>
                <h2 className="font-heading text-xl uppercase tracking-wide">
                  Collections
                </h2>
              </div>
              <Link
                href="/collections"
                className="font-mono text-xs text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.slice(0, 3).map((collection) => (
                <CollectionCard
                  key={collection.id}
                  name={collection.name}
                  slug={collection.slug}
                  description={collection.description}
                  lineupCount={collection.lineup_count}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {stripLineups.length > 0 && (
        <>
          <div className="h-px bg-border/50" aria-hidden="true" />
          <RecentLineupsStrip lineups={stripLineups} />
        </>
      )}
    </div>
  );
}
