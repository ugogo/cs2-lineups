import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LineupDetail } from "@/components/LineupDetail";
import { isAuthenticated } from "@/lib/auth";
import { getLineupById, getLineupsForMap } from "@/lib/queries";

interface LineupPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function LineupPage({ params, searchParams }: LineupPageProps) {
  return (
    <Suspense fallback={<LineupPageSkeleton />}>
      <LineupPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function LineupPageContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const lineup = await getLineupById(id);

  if (!lineup) {
    notFound();
  }

  const mapLineups = await getLineupsForMap(lineup.map_id);
  const isAdmin = await isAuthenticated();

  return (
    <LineupDetail
      lineup={lineup}
      mapLineups={mapLineups}
      searchParams={resolvedSearchParams}
      isAdmin={isAdmin}
    />
  );
}

function LineupPageSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 lg:grid-cols-[320px_1fr]">
      <div className="space-y-4">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="h-9 w-full rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-6 w-16 rounded-full bg-muted" />
        </div>
        <div className="h-20 rounded-xl bg-muted/50" />
      </div>
      <div className="aspect-video rounded-xl bg-muted/50" />
    </div>
  );
}
