import Image from "next/image";
import { MAIN_CONTENT_IMAGE_SIZES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getMapTheme, getMapLogoPath, hasMapLogoAsset, hasMapPosterAsset } from "@/lib/map-theme";

interface MapHeroBannerProps {
  mapSlug: string;
  mapName: string;
  lineupCount: number;
}

export function MapHeroBanner({
  mapSlug,
  mapName,
  lineupCount,
}: MapHeroBannerProps) {
  const theme = getMapTheme(mapSlug);
  const showImage = hasMapPosterAsset(mapSlug);
  const showLogo = hasMapLogoAsset(mapSlug);

  return (
    <div className="relative overflow-hidden rounded-xl ring-1 ring-border/60">
      <div className="relative h-28 sm:h-32">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r",
            theme.gradient,
          )}
        />
        {showImage && (
          <Image
            src={theme.imagePath}
            alt=""
            fill
            sizes={MAIN_CONTENT_IMAGE_SIZES}
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        {showLogo && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Image
              src={getMapLogoPath(mapSlug)}
              alt=""
              width={120}
              height={120}
              sizes="80px"
              className="h-14 w-auto opacity-80 drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:h-16"
            />
          </div>
        )}
        <div className="relative flex h-full flex-col justify-end px-5 pb-4 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            de_{mapSlug}
          </p>
          <div className="mt-0.5 flex flex-wrap items-end gap-3">
            <h1 className="font-heading text-2xl uppercase tracking-wider text-white sm:text-3xl">
              {mapName}
            </h1>
            <span className="mb-0.5 font-mono text-xs text-white/60">
              {lineupCount === 0
                ? "No lineups"
                : `${lineupCount} lineup${lineupCount === 1 ? "" : "s"}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
