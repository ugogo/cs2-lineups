"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMapTheme, hasMapPosterAsset } from "@/lib/map-theme";
import type { Map } from "@/lib/types";

interface MapPosterCardProps {
  map: Map & { lineup_count: number };
}

export function MapPosterCard({ map }: MapPosterCardProps) {
  const theme = getMapTheme(map.slug);
  const showImage = hasMapPosterAsset(map.slug);
  const isEmpty = map.lineup_count === 0;

  return (
    <Link
      href={`/maps/${map.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl ring-1 ring-border/60 transition duration-300",
        "hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isEmpty && "opacity-60 saturate-75 hover:opacity-80",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br transition duration-500 motion-reduce:transition-none",
            "group-hover:scale-105 motion-reduce:group-hover:scale-100",
            theme.gradient,
          )}
        />
        {showImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={theme.imagePath}
            alt=""
            className="absolute inset-0 size-full object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-75 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
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
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            de_{map.slug}
          </p>
          <div className="mt-1 flex items-end justify-between gap-3">
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
