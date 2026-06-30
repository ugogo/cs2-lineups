import { Suspense } from "react";
import { CollectionForm } from "@/components/admin/CollectionForm";
import { getAllLineupsAdmin } from "@/lib/queries";

export default function NewCollectionPage() {
  return (
    <Suspense fallback={<NewCollectionSkeleton />}>
      <NewCollectionContent />
    </Suspense>
  );
}

async function NewCollectionContent() {
  const lineups = await getAllLineupsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">New pack</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Group lineups into a practice collection
        </p>
      </div>
      <CollectionForm lineups={lineups} />
    </div>
  );
}

function NewCollectionSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-32 rounded bg-muted" />
        <div className="mt-2 h-4 w-56 rounded bg-muted/60" />
      </div>
      <div className="h-96 rounded-xl bg-muted/40" />
    </div>
  );
}
