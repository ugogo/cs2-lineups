import Link from "next/link";
import type { Lineup } from "@/lib/types";
import { GrenadeBadge, SideBadge, ThrowBadge } from "./Badges";
import { LineupImage } from "./LineupImage";

interface LineupCardProps {
  lineup: Lineup;
  mapSlug: string;
}

export function LineupCard({ lineup, mapSlug }: LineupCardProps) {
  return (
    <Link
      href={`/lineups/${lineup.id}`}
      className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 transition hover:border-orange-500/40"
    >
      <div className="flex aspect-video items-center justify-center overflow-hidden bg-zinc-950">
        <LineupImage
          src={lineup.position_image_url}
          alt={`${lineup.title} stand position`}
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
        />
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-medium text-zinc-100 group-hover:text-orange-300">
            {lineup.title}
          </h3>
          {lineup.site && (
            <p className="mt-0.5 text-xs text-zinc-500">
              {mapSlug} · {lineup.site}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <GrenadeBadge type={lineup.grenade_type} />
          <SideBadge side={lineup.side} />
          <ThrowBadge method={lineup.throw_method} />
        </div>
      </div>
    </Link>
  );
}
