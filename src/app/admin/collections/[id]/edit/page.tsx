import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getAllLineupsAdmin, getCollectionAdminById } from "@/lib/queries";

interface EditCollectionPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCollectionPage({ params }: EditCollectionPageProps) {
  return (
    <Suspense fallback={<EditCollectionSkeleton />}>
      <EditCollectionContent params={params} />
    </Suspense>
  );
}

async function EditCollectionContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [collection, lineups] = await Promise.all([
    getCollectionAdminById(id),
    getAllLineupsAdmin(),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit pack</h1>
        <p className="mt-1 text-sm text-muted-foreground">{collection.name}</p>
      </div>
      <CollectionForm
        lineups={lineups}
        initial={{
          id: collection.id,
          name: collection.name,
          description: collection.description,
          lineup_ids: collection.lineup_ids,
        }}
      />
    </div>
  );
}

function EditCollectionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-32 rounded bg-muted" />
        <div className="mt-2 h-4 w-48 rounded bg-muted/60" />
      </div>
      <div className="h-96 rounded-xl bg-muted/40" />
    </div>
  );
}
