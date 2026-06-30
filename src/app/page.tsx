import { MapGrid } from "@/components/MapGrid";
import { FeaturedLineupBanner } from "@/components/FeaturedLineupBanner";
import { RecentLineupsStrip } from "@/components/RecentLineupsStrip";
import { getMapsWithCounts, getRecentLineups } from "@/lib/queries";
import { ACTIVE_DUTY_MAPS } from "@/lib/constants";

export default async function HomePage() {
  const [maps, recentLineups] = await Promise.all([
    getMapsWithCounts(),
    getRecentLineups(6),
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

      {stripLineups.length > 0 && (
        <>
          <div className="h-px bg-border/50" aria-hidden="true" />
          <RecentLineupsStrip lineups={stripLineups} />
        </>
      )}
    </div>
  );
}
