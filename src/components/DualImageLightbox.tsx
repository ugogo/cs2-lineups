"use client";

import { useCallback, useEffect } from "react";

interface Shot {
  src: string;
  alt: string;
}

interface DualImageLightboxProps {
  open: boolean;
  onClose: () => void;
  title: string;
  position: Shot;
  aim: Shot;
}

export function DualImageLightbox({
  open,
  onClose,
  title,
  position,
  aim,
}: DualImageLightboxProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/95 p-3 backdrop-blur-sm sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Compare lineup screenshots: ${title}`}
    >
      <div
        className="mb-3 flex shrink-0 items-center justify-end"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-zinc-800/80 px-3 py-1.5 text-sm text-zinc-300 hover:text-white"
        >
          Close
        </button>
      </div>

      <div
        className="mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col gap-2 overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <ComparePanel shot={position} />
        <ComparePanel shot={aim} />
      </div>
    </div>
  );
}

function ComparePanel({ shot }: { shot: Shot }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot.src}
        alt={shot.alt}
        className="aspect-video w-full object-contain"
      />
    </figure>
  );
}
