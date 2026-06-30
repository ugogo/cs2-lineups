import { Suspense } from "react";
import { notFound } from "next/navigation";
import { MapLineupsView } from "@/components/MapLineupsView";
import { getMapWithLineupsBySlug } from "@/lib/queries";

interface MapPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function MapPage({ params, searchParams }: MapPageProps) {
  return (
    <Suspense fallback={<MapPageSkeleton />}>
      <MapPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function MapPageContent({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const result = await getMapWithLineupsBySlug(slug);

  if (!result) {
    notFound();
  }

  const { map, lineups } = result;

  return (
    <MapLineupsView
      lineups={lineups}
      mapSlug={map.slug}
      mapName={map.name}
      searchParams={resolvedSearchParams}
    />
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
