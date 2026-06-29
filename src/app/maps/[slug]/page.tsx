import { notFound } from "next/navigation";
import { LineupCard } from "@/components/LineupCard";
import { getLineupsForMap, getMapBySlug } from "@/lib/queries";

interface MapPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MapPage({ params }: MapPageProps) {
  const { slug } = await params;
  const map = await getMapBySlug(slug);

  if (!map) {
    notFound();
  }

  const lineups = await getLineupsForMap(map.id);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-zinc-500">de_{map.slug}</p>
        <h1 className="text-3xl font-bold text-zinc-100">{map.name}</h1>
        <p className="mt-2 text-zinc-400">
          {lineups.length === 0
            ? "No lineups saved yet. Add some from the admin panel."
            : `${lineups.length} lineup${lineups.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {lineups.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lineups.map((lineup) => (
            <LineupCard key={lineup.id} lineup={lineup} mapSlug={map.slug} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
          Empty map — head to Admin to add your first lineup.
        </div>
      )}
    </div>
  );
}
