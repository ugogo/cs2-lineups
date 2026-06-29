import type { GrenadeType, ThrowMethod } from "@/lib/types";
import { GRENADE_LABELS, THROW_LABELS } from "@/lib/constants";

const GRENADE_STYLES: Record<GrenadeType, string> = {
  smoke: "bg-slate-500/20 text-slate-300 ring-slate-500/30",
  flash: "bg-yellow-500/20 text-yellow-300 ring-yellow-500/30",
  molotov: "bg-orange-500/20 text-orange-300 ring-orange-500/30",
  he: "bg-red-500/20 text-red-300 ring-red-500/30",
};

export function GrenadeBadge({ type }: { type: GrenadeType }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${GRENADE_STYLES[type]}`}
    >
      {GRENADE_LABELS[type]}
    </span>
  );
}

export function ThrowBadge({ method }: { method: ThrowMethod }) {
  return (
    <span className="inline-flex rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300 ring-1 ring-zinc-700">
      {THROW_LABELS[method]}
    </span>
  );
}

export function SideBadge({ side }: { side: "T" | "CT" }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        side === "T"
          ? "bg-amber-500/15 text-amber-300 ring-amber-500/30"
          : "bg-sky-500/15 text-sky-300 ring-sky-500/30"
      }`}
    >
      {side} Side
    </span>
  );
}
