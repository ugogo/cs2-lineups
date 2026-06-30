import type { GrenadeType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

export function SmokeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={cn("size-4", className)}
      aria-hidden="true"
    >
      <circle cx="12" cy="14" r="5" />
      <path d="M9 9c0-2 1.5-3 3-3s3 1 3 3" />
      <path d="M7 12c-1.5 0-2.5-.8-2.5-2" />
      <path d="M17 12c1.5 0 2.5-.8 2.5-2" />
    </svg>
  );
}

export function FlashIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={cn("size-4", className)}
      aria-hidden="true"
    >
      <path d="M13 2 5 14h6l-1 8 8-12h-6l1-8z" />
    </svg>
  );
}

export function MolotovIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={cn("size-4", className)}
      aria-hidden="true"
    >
      <path d="M10 3c0 2 1 3 2 4 2 2 3 4 3 6a5 5 0 1 1-10 0c0-2 1-4 3-6 1-1 2-2 2-4" />
      <path d="M12 3V2" />
    </svg>
  );
}

export function HeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={cn("size-4", className)}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 5v3M12 16v3M5 12h3M16 12h3" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const GRENADE_ICONS: Record<GrenadeType, typeof SmokeIcon> = {
  smoke: SmokeIcon,
  flash: FlashIcon,
  molotov: MolotovIcon,
  he: HeIcon,
};

export function GrenadeIcon({
  type,
  className,
}: {
  type: GrenadeType;
  className?: string;
}) {
  const Icon = GRENADE_ICONS[type];
  return <Icon className={className} />;
}
