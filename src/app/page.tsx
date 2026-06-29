import { MapGrid } from "@/components/MapGrid";
import { getMapsWithCounts } from "@/lib/queries";

export default async function HomePage() {
  const maps = await getMapsWithCounts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Pick a map</h1>
        <p className="mt-2 max-w-xl text-zinc-400">
          Your personal smoke, flash, and molotov lineups — stand position, aim
          reference, and throw instructions in one place.
        </p>
      </div>
      <MapGrid maps={maps} />
    </div>
  );
}
