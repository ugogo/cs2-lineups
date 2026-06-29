import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MapLineupsView } from "@/components/MapLineupsView";
import { getLineupsForMap, getMapBySlug } from "@/lib/queries";

interface MapPageProps {
  params: Promise<{ slug: string }>;
}

export default function MapPage({ params }: MapPageProps) {
  return (
    <Suspense fallback={<MapPageSkeleton />}>
      <MapPageContent params={params} />
    </Suspense>
  );
}

async function MapPageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const map = await getMapBySlug(slug);

  if (!map) {
    notFound();
  }

  const lineups = await getLineupsForMap(map.id);

  return (
    <MapLineupsView lineups={lineups} mapSlug={map.slug} mapName={map.name} />
  );
}

function MapPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-4 w-24 rounded bg-zinc-800/60" />
        <div className="mt-2 h-9 w-48 rounded bg-zinc-800" />
        <div className="mt-2 h-5 w-32 rounded bg-zinc-800/60" />
      </div>
      <div className="h-32 rounded-xl bg-zinc-900/40" />
    </div>
  );
}
