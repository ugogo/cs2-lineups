import Image from "next/image";

interface LineupImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

export function LineupImage({
  src,
  alt,
  className,
  fill = false,
  priority = false,
  sizes,
}: LineupImageProps) {
  const isRemote = src.startsWith("http");

  if (isRemote) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : 1280}
        height={fill ? undefined : 720}
        className={className}
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        priority={priority}
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
    />
  );
}
