import { Suspense } from "react";
import Link from "next/link";
import { DeleteLineupButton } from "@/components/admin/DeleteLineupButton";
import { GrenadeBadge, SideBadge, ThrowBadge } from "@/components/Badges";
import { EmptyState } from "@/components/EmptyState";
import { getAllLineupsAdmin } from "@/lib/queries";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminPageContent />
    </Suspense>
  );
}

async function AdminPageContent() {
  const lineups = await getAllLineupsAdmin();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your lineup library
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AdminLogoutButton />
          <Link
            href="/admin/lineups/import"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Import from tweet
          </Link>
          <Link
            href="/admin/lineups/new"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Add lineup
          </Link>
        </div>
      </div>

      {lineups.length === 0 ? (
        <EmptyState
          title="No lineups yet"
          description={
            <>
              <Link href="/admin/lineups/new" className="text-primary hover:underline">
                Add your first one
              </Link>
            </>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border ring-1 ring-foreground/5">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Map</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Type</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lineups.map((lineup) => (
                <tr key={lineup.id} className="bg-card/30">
                  <td className="px-4 py-3">
                    <Link
                      href={`/lineups/${lineup.id}`}
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {lineup.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap gap-1 sm:hidden">
                      <SideBadge side={lineup.side} />
                      <ThrowBadge method={lineup.throw_method} />
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {lineup.maps.name}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <GrenadeBadge type={lineup.grenade_type} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/lineups/${lineup.id}/edit`}
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-primary")}
                      >
                        Edit
                      </Link>
                      <DeleteLineupButton id={lineup.id} />
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

function AdminPageSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="h-8 w-24 rounded bg-muted" />
          <div className="mt-2 h-4 w-40 rounded bg-muted/60" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-24 rounded-lg bg-muted" />
          <div className="h-9 w-28 rounded-lg bg-muted" />
        </div>
      </div>
      <div className="h-64 rounded-xl bg-muted/40" />
    </div>
  );
}
