import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LineupForm } from "@/components/admin/LineupForm";
import { getAllMaps, getLineupById } from "@/lib/queries";

interface EditLineupPageProps {
  params: Promise<{ id: string }>;
}

export default function EditLineupPage({ params }: EditLineupPageProps) {
  return (
    <Suspense fallback={<EditLineupSkeleton />}>
      <EditLineupContent params={params} />
    </Suspense>
  );
}

async function EditLineupContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lineup, maps] = await Promise.all([getLineupById(id), getAllMaps()]);

  if (!lineup) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit lineup</h1>
        <p className="mt-1 text-sm text-muted-foreground">{lineup.title}</p>
      </div>
      <LineupForm
        maps={maps}
        initial={{
          id: lineup.id,
          map_id: lineup.map_id,
          title: lineup.title,
          grenade_type: lineup.grenade_type,
          side: lineup.side,
          throw_method: lineup.throw_method,
          notes: lineup.notes,
          site: lineup.site,
          position_image_url: lineup.position_image_url,
          aim_image_url: lineup.aim_image_url,
        }}
      />
    </div>
  );
}

function EditLineupSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-40 rounded bg-muted" />
        <div className="mt-2 h-4 w-56 rounded bg-muted/60" />
      </div>
      <div className="h-96 rounded-xl bg-muted/40" />
    </div>
  );
}
