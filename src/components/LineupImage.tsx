interface LineupImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function LineupImage({ src, alt, className }: LineupImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`max-h-full max-w-full ${className ?? ""}`}
      decoding="async"
    />
  );
}
