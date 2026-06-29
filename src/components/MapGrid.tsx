import Link from "next/link";
import type { Map } from "@/lib/types";

interface MapGridProps {
  maps: (Map & { lineup_count: number })[];
}

export function MapGrid({ maps }: MapGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {maps.map((map) => (
        <Link
          key={map.id}
          href={`/maps/${map.slug}`}
          className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-orange-500/40 hover:bg-zinc-900"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 group-hover:text-orange-300">
                {map.name}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {map.lineup_count === 0
                  ? "No lineups yet"
                  : `${map.lineup_count} lineup${map.lineup_count === 1 ? "" : "s"}`}
              </p>
            </div>
            <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-400">
              de_{map.slug}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
