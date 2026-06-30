import type { GrenadeType, Side, ThrowMethod } from "@/lib/types";
import { GRENADE_LABELS, THROW_LABELS } from "@/lib/constants";

export const GRENADE_BORDER_CLASS: Record<GrenadeType, string> = {
  smoke: "border-l-grenade-smoke",
  flash: "border-l-grenade-flash",
  molotov: "border-l-grenade-molotov",
  he: "border-l-grenade-he",
};

export const GRENADE_BADGE_CLASS: Record<GrenadeType, string> = {
  smoke: "bg-grenade-smoke/15 text-grenade-smoke border-grenade-smoke/30",
  flash: "bg-grenade-flash/15 text-grenade-flash border-grenade-flash/30",
  molotov: "bg-grenade-molotov/15 text-grenade-molotov border-grenade-molotov/30",
  he: "bg-grenade-he/15 text-grenade-he border-grenade-he/30",
};

export const GRENADE_FILTER_ACTIVE_CLASS: Record<GrenadeType, string> = {
  smoke:
    "data-[state=on]:bg-grenade-smoke/25 data-[state=on]:text-grenade-smoke data-[state=on]:border-grenade-smoke/50",
  flash:
    "data-[state=on]:bg-grenade-flash/25 data-[state=on]:text-grenade-flash data-[state=on]:border-grenade-flash/50",
  molotov:
    "data-[state=on]:bg-grenade-molotov/25 data-[state=on]:text-grenade-molotov data-[state=on]:border-grenade-molotov/50",
  he: "data-[state=on]:bg-grenade-he/25 data-[state=on]:text-grenade-he data-[state=on]:border-grenade-he/50",
};

export const SIDE_BADGE_CLASS: Record<Side, string> = {
  T: "bg-side-t/15 text-side-t border-side-t/30",
  CT: "bg-side-ct/15 text-side-ct border-side-ct/30",
};

export const SIDE_FILTER_ACTIVE_CLASS: Record<Side, string> = {
  T: "data-[state=on]:bg-side-t/25 data-[state=on]:text-side-t data-[state=on]:border-side-t/50",
  CT: "data-[state=on]:bg-side-ct/25 data-[state=on]:text-side-ct data-[state=on]:border-side-ct/50",
};

export function grenadeLabel(type: GrenadeType): string {
  return GRENADE_LABELS[type];
}

export function throwLabel(method: ThrowMethod): string {
  return THROW_LABELS[method];
}
