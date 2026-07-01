import { LineupCard } from "@/components/LineupCard";
import type { LineupWithMap } from "@/lib/types";

interface RecentLineupsStripProps {
  lineups: LineupWithMap[];
}

export function RecentLineupsStrip({ lineups }: RecentLineupsStripProps) {
  if (lineups.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Quick access
          </p>
          <h2 className="font-heading text-xl uppercase tracking-wider">
            Recently added
          </h2>
        </div>
        <p className="hidden font-mono text-xs text-muted-foreground sm:block">
          Scroll →
        </p>
      </div>
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent"
          aria-hidden="true"
        />
        <div className="-mx-4 overflow-x-auto px-4 pb-4 [scrollbar-width:thin]">
          <div className="flex w-max gap-4">
            {lineups.map((lineup) => (
              <div key={lineup.id} className="w-72 shrink-0">
                <LineupCard
                  lineup={lineup}
                  mapSlug={lineup.maps.slug}
                  mapName={lineup.maps.name}
                  accentBorder={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
