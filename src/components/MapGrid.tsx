import { MapPosterCard } from "@/components/MapPosterCard";
import type { Map } from "@/lib/types";

interface MapGridProps {
  maps: (Map & { lineup_count: number })[];
}

export function MapGrid({ maps }: MapGridProps) {
  const sorted = [...maps].sort((a, b) => {
    if (b.lineup_count !== a.lineup_count) {
      return b.lineup_count - a.lineup_count;
    }
    return a.sort_order - b.sort_order;
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sorted.map((map) => (
        <MapPosterCard key={map.id} map={map} />
      ))}
    </div>
  );
}
