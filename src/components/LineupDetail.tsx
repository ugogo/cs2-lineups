import Link from "next/link";
import type { LineupWithMap } from "@/lib/types";
import { SOURCE_LABELS } from "@/lib/constants";
import { GrenadeBadge, SideBadge, ThrowBadge } from "./Badges";
import { LineupScreenshotViewer } from "./LineupScreenshotViewer";

interface LineupDetailProps {
  lineup: LineupWithMap;
}

export function LineupDetail({ lineup }: LineupDetailProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Link
          href={`/maps/${lineup.maps.slug}`}
          className="text-sm text-zinc-500 hover:text-orange-400"
        >
          ← Back to {lineup.maps.name}
        </Link>
        <h1 className="text-2xl font-bold text-zinc-100 sm:text-3xl">
          {lineup.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          <GrenadeBadge type={lineup.grenade_type} />
          <SideBadge side={lineup.side} />
          <ThrowBadge method={lineup.throw_method} />
          {lineup.site && (
            <span className="inline-flex rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-400 ring-1 ring-zinc-700">
              {lineup.site}
            </span>
          )}
        </div>
        {lineup.source_type === "twitter" && lineup.source_url && (
          <p className="text-sm text-zinc-500">
            Source:{" "}
            <a
              href={lineup.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300"
            >
              {SOURCE_LABELS.twitter}
            </a>
          </p>
        )}
      </div>

      <div className="space-y-4">
        <LineupScreenshotViewer
          title={lineup.title}
          positionSrc={lineup.position_image_url}
          aimSrc={lineup.aim_image_url}
        />
      </div>

      {lineup.notes && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h2 className="text-sm font-medium text-zinc-400">Notes</h2>
          <p className="mt-2 whitespace-pre-wrap text-zinc-200">{lineup.notes}</p>
        </div>
      )}
    </div>
  );
}
