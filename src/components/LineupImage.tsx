import Image from "next/image";
import { LINEUP_CARD_IMAGE_SIZES } from "@/lib/constants";

interface LineupImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

function isOptimizableSrc(src: string): boolean {
  return src.startsWith("http") || src.startsWith("/");
}

export function LineupImage({
  src,
  alt,
  className,
  fill = false,
  priority = false,
  sizes,
}: LineupImageProps) {
  if (isOptimizableSrc(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : 1280}
        height={fill ? undefined : 720}
        className={className}
        sizes={sizes ?? LINEUP_CARD_IMAGE_SIZES}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
    );
  }

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className ?? ""}`}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`max-h-full max-w-full ${className ?? ""}`}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
    />
  );
}
