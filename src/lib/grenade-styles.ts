import type { GrenadeType, Side, ThrowMethod } from "@/lib/types";
import { GRENADE_LABELS, THROW_LABELS } from "@/lib/constants";

export const GRENADE_BORDER_CLASS: Record<GrenadeType, string> = {
  smoke: "border-l-slate-400",
  flash: "border-l-yellow-400",
  molotov: "border-l-orange-400",
  he: "border-l-red-400",
};

export const GRENADE_BADGE_CLASS: Record<GrenadeType, string> = {
  smoke: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  flash: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  molotov: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  he: "bg-red-500/15 text-red-300 border-red-500/30",
};

export const GRENADE_FILTER_ACTIVE_CLASS: Record<GrenadeType, string> = {
  smoke: "data-[state=on]:bg-slate-500/25 data-[state=on]:text-slate-200 data-[state=on]:border-slate-400/50",
  flash: "data-[state=on]:bg-yellow-500/25 data-[state=on]:text-yellow-200 data-[state=on]:border-yellow-400/50",
  molotov: "data-[state=on]:bg-orange-500/25 data-[state=on]:text-orange-200 data-[state=on]:border-orange-400/50",
  he: "data-[state=on]:bg-red-500/25 data-[state=on]:text-red-200 data-[state=on]:border-red-400/50",
};

export const SIDE_BADGE_CLASS: Record<Side, string> = {
  T: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  CT: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

export const SIDE_FILTER_ACTIVE_CLASS: Record<Side, string> = {
  T: "data-[state=on]:bg-amber-500/25 data-[state=on]:text-amber-200 data-[state=on]:border-amber-400/50",
  CT: "data-[state=on]:bg-sky-500/25 data-[state=on]:text-sky-200 data-[state=on]:border-sky-400/50",
};

export function grenadeLabel(type: GrenadeType): string {
  return GRENADE_LABELS[type];
}

export function throwLabel(method: ThrowMethod): string {
  return THROW_LABELS[method];
}
