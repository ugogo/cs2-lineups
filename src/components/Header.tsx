import { Suspense } from "react";
import { HeaderNav } from "@/components/HeaderNav";

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
        <div className="size-8 rounded-md bg-muted/50" />
        <div className="size-7 rounded-md bg-muted/30" />
      </div>
    </header>
  );
}

export function Header() {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderNav />
    </Suspense>
  );
}
