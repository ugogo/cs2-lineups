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
    <div className="space-y-6 animate-pulse">
      <div className="h-28 rounded-xl bg-muted/50 sm:h-32" />
      <div className="h-10 rounded-lg bg-muted/30" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/40" />
        <div className="aspect-video rounded-xl bg-muted/40" />
        <div className="aspect-video rounded-xl bg-muted/40" />
      </div>
    </div>
  );
}
