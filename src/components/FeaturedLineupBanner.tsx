import Link from "next/link";
import { GrenadeBadge, SideBadge } from "@/components/Badges";
import { LineupImage } from "@/components/LineupImage";
import { throwLabel } from "@/lib/grenade-styles";
import type { LineupWithMap } from "@/lib/types";

interface FeaturedLineupBannerProps {
  lineup: LineupWithMap;
}

export function FeaturedLineupBanner({ lineup }: FeaturedLineupBannerProps) {
  return (
    <Link
      href={`/lineups/${lineup.id}`}
      className="group relative block overflow-hidden rounded-xl ring-1 ring-border/60 transition hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[21/9] max-h-44 sm:max-h-48">
        <LineupImage
          src={lineup.position_image_url}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />
        <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Latest lineup · {lineup.maps.name}
          </p>
          <h2 className="mt-1 max-w-2xl font-heading text-lg uppercase leading-tight tracking-wide text-white sm:text-xl">
            {lineup.title}
          </h2>
          <p className="mt-1 font-mono text-xs text-white/60">
            {throwLabel(lineup.throw_method)}
            {lineup.site ? ` · ${lineup.site}` : ""}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <GrenadeBadge type={lineup.grenade_type} />
            <SideBadge side={lineup.side} />
          </div>
        </div>
      </div>
    </Link>
  );
}
