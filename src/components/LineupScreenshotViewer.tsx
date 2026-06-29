"use client";

import { useState } from "react";
import { DualImageLightbox } from "@/components/DualImageLightbox";
import { ImageLightbox } from "@/components/ImageLightbox";
import { LineupImage } from "@/components/LineupImage";

interface LineupScreenshotViewerProps {
  title: string;
  positionSrc: string;
  aimSrc: string;
}

interface SingleView {
  src: string;
  alt: string;
}

export function LineupScreenshotViewer({
  title,
  positionSrc,
  aimSrc,
}: LineupScreenshotViewerProps) {
  const [singleView, setSingleView] = useState<SingleView | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const positionAlt = `${title} player position`;
  const aimAlt = `${title} aim reference`;

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCompareOpen(true)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 p-2 text-zinc-200 transition hover:border-orange-500/50 hover:text-white"
          aria-label="Compare both screenshots"
          title="Compare both"
        >
          <ZoomIcon />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScreenshotPanel
          src={positionSrc}
          alt={positionAlt}
          onZoom={() => setSingleView({ src: positionSrc, alt: positionAlt })}
        />
        <ScreenshotPanel
          src={aimSrc}
          alt={aimAlt}
          onZoom={() => setSingleView({ src: aimSrc, alt: aimAlt })}
        />
      </div>

      <ImageLightbox
        src={singleView?.src ?? ""}
        alt={singleView?.alt ?? ""}
        open={singleView !== null}
        onClose={() => setSingleView(null)}
      />

      <DualImageLightbox
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        title={title}
        position={{
          src: positionSrc,
          alt: positionAlt,
        }}
        aim={{
          src: aimSrc,
          alt: aimAlt,
        }}
      />
    </>
  );
}

function ScreenshotPanel({
  src,
  alt,
  onZoom,
}: {
  src: string;
  alt: string;
  onZoom: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <button
        type="button"
        onClick={onZoom}
        className="group relative flex aspect-video w-full cursor-zoom-in items-center justify-center p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50"
        aria-label={`Enlarge: ${alt}`}
      >
        <LineupImage src={src} alt={alt} className="object-contain" fill />
        <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs text-zinc-300 opacity-0 transition group-hover:opacity-100">
          Click to enlarge
        </span>
      </button>
    </div>
  );
}

function ZoomIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}
