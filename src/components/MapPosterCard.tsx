import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MAP_CARD_IMAGE_SIZES } from "@/lib/constants";
import { MapLogo } from "@/components/MapLogo";
import { cn } from "@/lib/utils";
import { getMapTheme, hasMapLogoAsset, hasMapPosterAsset } from "@/lib/map-theme";
import type { Map } from "@/lib/types";

interface MapPosterCardProps {
  map: Map & { lineup_count: number };
}

export function MapPosterCard({ map }: MapPosterCardProps) {
  const theme = getMapTheme(map.slug);
  const showImage = hasMapPosterAsset(map.slug);
  const showLogo = hasMapLogoAsset(map.slug);
  const isEmpty = map.lineup_count === 0;

  return (
    <Link
      href={`/maps/${map.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl ring-1 ring-border/60 transition duration-300",
        "hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 transition duration-500 motion-reduce:transition-none",
            "group-hover:scale-105 motion-reduce:group-hover:scale-100",
            isEmpty && "opacity-60 saturate-75 group-hover:opacity-80",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br",
              theme.gradient,
            )}
          />
          {showImage && (
            <Image
              src={theme.imagePath}
              alt=""
              fill
              sizes={MAP_CARD_IMAGE_SIZES}
              className="object-cover opacity-60 transition duration-500 group-hover:opacity-75 motion-reduce:transition-none"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          {!isEmpty && (
            <div
              className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 motion-reduce:transition-none"
              style={{
                boxShadow: `inset 0 0 60px ${theme.accent}22`,
              }}
            />
          )}
        </div>
        {showLogo && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center transition duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <div className="relative aspect-square h-[55%]">
              <MapLogo
                slug={map.slug}
                sizes="(max-width: 1024px) 40vw, 20vw"
                className="drop-shadow-[0_4px_24px_rgba(0,0,0,0.65)]"
              />
            </div>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 z-10 p-5">
          <div className="flex items-end justify-between gap-3">
            <h2 className="font-heading text-2xl uppercase tracking-wider text-white">
              {map.name}
            </h2>
            <ArrowRight
              className="mb-1 size-4 shrink-0 text-white/0 transition group-hover:text-white/80 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-xs text-white/80 ring-1 ring-white/10">
            {map.lineup_count === 0
              ? "No lineups"
              : `${map.lineup_count} lineup${map.lineup_count === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
