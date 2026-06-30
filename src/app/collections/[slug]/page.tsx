import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionLineupsGrid } from "@/components/Collections";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCollectionBySlug } from "@/lib/queries";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  return (
    <Suspense fallback={<CollectionPageSkeleton />}>
      <CollectionPageContent params={params} />
    </Suspense>
  );
}

async function CollectionPageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <Link
          href="/collections"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
        >
          ← All packs
        </Link>
        <div className="space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            Practice pack
          </p>
          <h1 className="font-heading text-3xl uppercase tracking-wider sm:text-4xl">
            {collection.name}
          </h1>
          {collection.description && (
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {collection.description}
            </p>
          )}
          <p className="font-mono text-xs text-muted-foreground">
            {collection.lineups.length} lineup
            {collection.lineups.length === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      <CollectionLineupsGrid lineups={collection.lineups} />
    </div>
  );
}

function CollectionPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-24 rounded bg-muted" />
      <div className="space-y-3">
        <div className="h-4 w-28 rounded bg-muted/60" />
        <div className="h-10 w-64 rounded bg-muted" />
        <div className="h-4 w-96 max-w-full rounded bg-muted/60" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="aspect-[4/3] rounded-xl bg-muted/40" />
        ))}
      </div>
    </div>
  );
}
