import { TweetImportForm } from "@/components/admin/TweetImportForm";
import { getAllMaps } from "@/lib/queries";

export default async function ImportLineupPage() {
  const maps = await getAllMaps();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Import from tweet</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Paste a tweet URL to download the video, scrub the timeline to pick position
          and aim frames, then publish.
        </p>
      </div>
      <TweetImportForm maps={maps} />
    </div>
  );
}
