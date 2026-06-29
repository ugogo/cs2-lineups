import { LineupForm } from "@/components/admin/LineupForm";
import { getAllMaps } from "@/lib/queries";

export default async function NewLineupPage() {
  const maps = await getAllMaps();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Add lineup</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Upload your stand position and aim reference screenshots, or{" "}
          <a
            href="/admin/lineups/import"
            className="text-orange-400 hover:underline"
          >
            import from a tweet
          </a>
          .
        </p>
      </div>
      <LineupForm maps={maps} />
    </div>
  );
}
