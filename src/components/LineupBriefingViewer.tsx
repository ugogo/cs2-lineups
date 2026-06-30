"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LineupImage } from "@/components/LineupImage";
import { buttonVariants } from "@/components/ui/button";
import { LINEUP_DETAIL_IMAGE_SIZES } from "@/lib/constants";
import { lineupDetailHref } from "@/lib/lineup-filters";
import type { LineupFilters } from "@/lib/lineup-filters";
import { cn } from "@/lib/utils";

const ImageLightbox = dynamic(
  () =>
    import("@/components/ImageLightbox").then((mod) => ({
      default: mod.ImageLightbox,
    })),
  { ssr: false },
);

interface LineupBriefingViewerProps {
  title: string;
  positionSrc: string;
  aimSrc: string;
  prevId: string | null;
  nextId: string | null;
  filters: LineupFilters;
}

interface SingleView {
  src: string;
  alt: string;
  label: string;
}

export function LineupBriefingViewer({
  title,
  positionSrc,
  aimSrc,
  prevId,
  nextId,
  filters,
}: LineupBriefingViewerProps) {
  const router = useRouter();
  const [singleView, setSingleView] = useState<SingleView | null>(null);

  const positionAlt = `${title} — stand here`;
  const aimAlt = `${title} — aim here`;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (singleView) return;
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          if (prevId) {
            router.push(lineupDetailHref(prevId, filters));
          }
          break;
        case "ArrowRight":
          if (nextId) {
            router.push(lineupDetailHref(nextId, filters));
          }
          break;
        default:
          break;
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [singleView, prevId, nextId, filters, router]);

  return (
    <div className="space-y-6">
      <ScreenshotViewport
        src={positionSrc}
        alt={positionAlt}
        label="Stand here"
        step={1}
        priority
        onEnlarge={() =>
          setSingleView({ src: positionSrc, alt: positionAlt, label: "Stand here" })
        }
      />

      <ScreenshotViewport
        src={aimSrc}
        alt={aimAlt}
        label="Aim here"
        step={2}
        onEnlarge={() =>
          setSingleView({ src: aimSrc, alt: aimAlt, label: "Aim here" })
        }
      />

      <div className="flex items-center justify-between gap-4 border-t border-border/50 pt-4">
        {prevId ? (
          <Link
            href={lineupDetailHref(prevId, filters)}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Link>
        ) : (
          <div />
        )}
        <p className="font-mono text-xs text-muted-foreground">← → navigate</p>
        {nextId ? (
          <Link
            href={lineupDetailHref(nextId, filters)}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1")}
          >
            Next
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {singleView && (
        <ImageLightbox
          src={singleView.src}
          alt={singleView.alt}
          label={singleView.label}
          open
          onClose={() => setSingleView(null)}
        />
      )}
    </div>
  );
}

function ScreenshotViewport({
  src,
  alt,
  label,
  step,
  priority = false,
  onEnlarge,
}: {
  src: string;
  alt: string;
  label: string;
  step: number;
  priority?: boolean;
  onEnlarge: () => void;
}) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
        Step {step} — {label}
      </p>
      <button
        type="button"
        onClick={onEnlarge}
        className={cn(
          "group relative block w-full aspect-video cursor-zoom-in overflow-hidden",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        )}
        aria-label={`Enlarge: ${label}`}
      >
        <LineupImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={LINEUP_DETAIL_IMAGE_SIZES}
          className="object-contain"
        />
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 font-mono text-xs text-white/80 opacity-0 transition group-hover:opacity-100 motion-reduce:transition-none">
          <Maximize2 className="size-3" />
          Enlarge
        </span>
      </button>
    </div>
  );
}
