import Link from "next/link";
import { DeleteLineupButton } from "@/components/admin/DeleteLineupButton";
import { GrenadeBadge, SideBadge, ThrowBadge } from "@/components/Badges";
import { getAllLineupsAdmin } from "@/lib/queries";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export default async function AdminPage() {
  const lineups = await getAllLineupsAdmin();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Admin</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage your lineup library
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AdminLogoutButton />
          <Link
            href="/admin/lineups/import"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:text-white"
          >
            Import from tweet
          </Link>
          <Link
            href="/admin/lineups/new"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
          >
            Add lineup
          </Link>
        </div>
      </div>

      {lineups.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center text-zinc-500">
          No lineups yet.{" "}
          <Link href="/admin/lineups/new" className="text-orange-400 hover:underline">
            Add your first one
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-900/80 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Map</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Type</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {lineups.map((lineup) => (
                <tr key={lineup.id} className="bg-zinc-950/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-200">{lineup.title}</p>
                    <div className="mt-1 flex flex-wrap gap-1 sm:hidden">
                      <SideBadge side={lineup.side} />
                      <ThrowBadge method={lineup.throw_method} />
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-400 sm:table-cell">
                    {lineup.maps.name}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <GrenadeBadge type={lineup.grenade_type} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/lineups/${lineup.id}/edit`}
                        className="text-sm text-orange-400 hover:text-orange-300"
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
