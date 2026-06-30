import { Suspense } from "react";
import Link from "next/link";
import { CollectionCard } from "@/components/Collections";
import { EmptyState } from "@/components/EmptyState";
import { getCollectionsWithCounts } from "@/lib/queries";

export default function CollectionsPage() {
  return (
    <Suspense fallback={<CollectionsPageSkeleton />}>
      <CollectionsPageContent />
    </Suspense>
  );
}

async function CollectionsPageContent() {
  const collections = await getCollectionsWithCounts();

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
          Practice packs
        </p>
        <h1 className="font-heading text-3xl uppercase tracking-wider sm:text-4xl">
          Collections
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          Curated sets of lineups for executes, retakes, and map-specific practice.
        </p>
      </header>

      {collections.length === 0 ? (
        <EmptyState
          title="No packs yet"
          description={
            <>
              Create one in{" "}
              <Link href="/admin/collections" className="text-primary hover:underline">
                Admin
              </Link>
              .
            </>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              name={collection.name}
              slug={collection.slug}
              description={collection.description}
              lineupCount={collection.lineup_count}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CollectionsPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-28 rounded bg-muted/60" />
        <div className="h-10 w-56 rounded bg-muted" />
        <div className="h-4 w-80 max-w-full rounded bg-muted/60" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-40 rounded-xl bg-muted/40" />
        ))}
      </div>
    </div>
  );
}
