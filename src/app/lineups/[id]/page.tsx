import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LineupDetail } from "@/components/LineupDetail";
import { getLineupById } from "@/lib/queries";

interface LineupPageProps {
  params: Promise<{ id: string }>;
}

export default function LineupPage({ params }: LineupPageProps) {
  return (
    <Suspense fallback={<LineupPageSkeleton />}>
      <LineupPageContent params={params} />
    </Suspense>
  );
}

async function LineupPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lineup = await getLineupById(id);

  if (!lineup) {
    notFound();
  }

  return <LineupDetail lineup={lineup} />;
}

function LineupPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-4 w-32 rounded bg-zinc-800/60" />
      <div className="h-9 w-64 rounded bg-zinc-800" />
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-zinc-800" />
        <div className="h-6 w-16 rounded-full bg-zinc-800" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="aspect-video rounded-xl bg-zinc-900/50" />
        <div className="aspect-video rounded-xl bg-zinc-900/50" />
      </div>
    </div>
  );
}
