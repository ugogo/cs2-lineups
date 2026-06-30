import { Suspense } from "react";
import Link from "next/link";
import { DeleteCollectionButton } from "@/components/admin/DeleteCollectionButton";
import { EmptyState } from "@/components/EmptyState";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { getAllCollectionsAdmin } from "@/lib/queries";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminCollectionsPage() {
  return (
    <Suspense fallback={<AdminCollectionsSkeleton />}>
      <AdminCollectionsContent />
    </Suspense>
  );
}

async function AdminCollectionsContent() {
  const collections = await getAllCollectionsAdmin();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Collections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Group lineups into practice packs
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminLogoutButton />
          <Link
            href="/admin"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Lineups
          </Link>
          <Link
            href="/admin/collections/new"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            New pack
          </Link>
        </div>
      </div>

      {collections.length === 0 ? (
        <EmptyState
          title="No packs yet"
          description={
            <>
              <Link
                href="/admin/collections/new"
                className="text-primary hover:underline"
              >
                Create your first pack
              </Link>
            </>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border ring-1 ring-foreground/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Lineups</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {collections.map((collection) => (
                <tr key={collection.id} className="bg-card/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/collections/${collection.slug}`}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {collection.name}
                    </Link>
                    <p className="mt-1 font-mono text-xs text-muted-foreground sm:hidden">
                      {collection.lineup_count} lineup
                      {collection.lineup_count === 1 ? "" : "s"}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {collection.lineup_count}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/collections/${collection.id}/edit`}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                          "text-primary",
                        )}
                      >
                        Edit
                      </Link>
                      <DeleteCollectionButton
                        id={collection.id}
                        name={collection.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminCollectionsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="h-8 w-40 rounded bg-muted" />
          <div className="mt-2 h-4 w-56 rounded bg-muted/60" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-lg bg-muted" />
          <div className="h-9 w-28 rounded-lg bg-muted" />
        </div>
      </div>
      <div className="h-64 rounded-xl bg-muted/40" />
    </div>
  );
}
