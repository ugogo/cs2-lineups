"use client";

import { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { LineupImage } from "@/components/LineupImage";
import { Button } from "@/components/ui/button";
import { useFocusTrap } from "@/hooks/use-focus-trap";

interface ImageLightboxProps {
  src: string;
  alt: string;
  label?: string;
  open: boolean;
  onClose: () => void;
}

export function ImageLightbox({
  src,
  alt,
  label,
  open,
  onClose,
}: ImageLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = "lightbox-title";

  useFocusTrap(open, dialogRef);

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
      ref={dialogRef}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="flex shrink-0 items-center justify-between px-4 py-3"
        onClick={(event) => event.stopPropagation()}
      >
        <p
          id={titleId}
          className="font-mono text-xs uppercase tracking-[0.15em] text-white/60"
        >
          {label ?? alt}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="min-h-11 text-white/70 hover:text-white"
        >
          <X className="size-4" />
          Close
        </Button>
      </div>
      <div className="relative flex flex-1 items-center justify-center p-4 pt-0">
        <div
          className="relative h-[85vh] w-[95vw] max-w-full"
          onClick={(event) => event.stopPropagation()}
        >
          <LineupImage
            src={src}
            alt={alt}
            fill
            priority
            sizes="95vw"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
