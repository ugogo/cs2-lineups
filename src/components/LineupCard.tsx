import Link from "next/link";
import { LINEUP_CARD_IMAGE_SIZES } from "@/lib/constants";
import type { Lineup } from "@/lib/types";
import { GrenadeBadge, SideBadge } from "./Badges";
import { LineupImage } from "./LineupImage";
import { GRENADE_BORDER_CLASS } from "@/lib/grenade-styles";
import { throwLabel } from "@/lib/grenade-styles";
import { cn } from "@/lib/utils";

interface LineupCardProps {
  lineup: Lineup;
  mapSlug: string;
  mapName?: string;
  filterQuery?: string;
  accentBorder?: boolean;
}

export function LineupCard({
  lineup,
  mapSlug,
  mapName,
  filterQuery,
  accentBorder = true,
}: LineupCardProps) {
  const href = filterQuery
    ? `/lineups/${lineup.id}?${filterQuery}`
    : `/lineups/${lineup.id}`;

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/50 transition duration-200 hover:border-primary/30 hover:bg-card",
        accentBorder && "border-l-4",
        accentBorder && GRENADE_BORDER_CLASS[lineup.grenade_type],
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-muted/30">
        <LineupImage
          src={lineup.position_image_url}
          alt={`${lineup.title} stand position`}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          sizes={LINEUP_CARD_IMAGE_SIZES}
        />
        <div className="absolute bottom-2 right-2 size-16 overflow-hidden rounded-md ring-2 ring-background/80">
          <LineupImage
            src={lineup.aim_image_url}
            alt={`${lineup.title} aim reference`}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      </div>
      <div className="space-y-2.5 p-4">
        <div>
          <h3 className="font-medium leading-snug text-foreground group-hover:text-primary">
            {lineup.title}
          </h3>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {throwLabel(lineup.throw_method)}
            {lineup.site ? ` · ${lineup.site}` : ""}
            {mapName ? ` · ${mapName}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <GrenadeBadge type={lineup.grenade_type} />
          <SideBadge side={lineup.side} />
        </div>
      </div>
    </Link>
  );
}
