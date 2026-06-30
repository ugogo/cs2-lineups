import type { GrenadeType, ThrowMethod } from "@/lib/types";
import { SIDE_LABELS, GRENADE_LABELS, THROW_LABELS } from "@/lib/constants";
import {
  GRENADE_BADGE_CLASS,
  SIDE_BADGE_CLASS,
} from "@/lib/grenade-styles";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function GrenadeBadge({ type }: { type: GrenadeType }) {
  return (
    <Badge
      variant="outline"
      className={cn("border", GRENADE_BADGE_CLASS[type])}
    >
      {GRENADE_LABELS[type]}
    </Badge>
  );
}

export function ThrowBadge({ method }: { method: ThrowMethod }) {
  return (
    <Badge variant="outline" className="border-border/60 font-mono text-[11px]">
      {THROW_LABELS[method]}
    </Badge>
  );
}

export function SideBadge({ side }: { side: "T" | "CT" }) {
  return (
    <Badge
      variant="outline"
      className={cn("border", SIDE_BADGE_CLASS[side])}
    >
      {SIDE_LABELS[side]}
    </Badge>
  );
}

export function SiteBadge({ site }: { site: string }) {
  return (
    <Badge variant="outline" className="border-border/60 font-mono text-[11px]">
      {site}
    </Badge>
  );
}
