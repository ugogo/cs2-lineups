import Link from "next/link";
import type { LineupWithMap } from "@/lib/types";
import { GrenadeBadge, SideBadge, ThrowBadge } from "./Badges";
import { LineupImage } from "./LineupImage";

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
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ScreenshotPanel
          label="1. Stand here"
          description="Player position"
          src={lineup.position_image_url}
          alt={`${lineup.title} player position`}
        />
        <ScreenshotPanel
          label="2. Aim here"
          description="Crosshair reference"
          src={lineup.aim_image_url}
          alt={`${lineup.title} aim reference`}
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

function ScreenshotPanel({
  label,
  description,
  src,
  alt,
}: {
  label: string;
  description: string;
  src: string;
  alt: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="border-b border-zinc-800 px-4 py-3">
        <p className="text-sm font-medium text-orange-400">{label}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <div className="flex aspect-video items-center justify-center bg-zinc-950 p-2">
        <LineupImage
          src={src}
          alt={alt}
          className="object-contain"
        />
      </div>
    </div>
  );
}
