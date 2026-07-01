import Image from "next/image";
import { getMapLogoPath, hasMapLogoAsset } from "@/lib/map-theme";
import { cn } from "@/lib/utils";

interface MapLogoProps {
  slug: string;
  className?: string;
  containerClassName?: string;
  sizes?: string;
}

export function MapLogo({
  slug,
  className,
  containerClassName,
  sizes = "50vw",
}: MapLogoProps) {
  if (!hasMapLogoAsset(slug)) {
    return null;
  }

  return (
    <div className={cn("relative size-full min-h-0 min-w-0", containerClassName)}>
      <Image
        src={getMapLogoPath(slug)}
        alt=""
        fill
        sizes={sizes}
        className={cn("object-contain object-center", className)}
      />
    </div>
  );
}
