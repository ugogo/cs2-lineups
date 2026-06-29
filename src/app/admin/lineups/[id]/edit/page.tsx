import { notFound } from "next/navigation";
import { LineupForm } from "@/components/admin/LineupForm";
import { getAllMaps, getLineupById } from "@/lib/queries";

interface EditLineupPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLineupPage({ params }: EditLineupPageProps) {
  const { id } = await params;
  const [lineup, maps] = await Promise.all([getLineupById(id), getAllMaps()]);

  if (!lineup) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Edit lineup</h1>
        <p className="mt-1 text-sm text-zinc-500">{lineup.title}</p>
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
