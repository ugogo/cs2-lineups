"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crosshair, Settings } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function HeaderNav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
          <Link
            href="/"
            className="font-heading text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            ← Back to lineups
          </Link>
          <span className="font-mono text-xs text-muted-foreground">Admin</span>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
              <Crosshair className="size-4" aria-hidden="true" />
            </span>
            <span className="hidden font-heading text-sm uppercase tracking-widest text-foreground sm:inline">
              CS2 Lineups
            </span>
          </Link>
          <HeaderBreadcrumb pathname={pathname} />
        </div>
        <Link
          href="/admin"
          aria-label="Admin"
          className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
        >
          <Settings className="size-4" />
        </Link>
      </div>
    </header>
  );
}

function HeaderBreadcrumb({ pathname }: { pathname: string }) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  if (segments[0] === "maps" && segments[1]) {
    const mapSlug = segments[1];
    const mapName = formatMapName(mapSlug);
    return (
      <Breadcrumb className="hidden min-w-0 sm:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Maps</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate font-mono text-xs uppercase">
              {mapName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return null;
}

function formatMapName(slug: string): string {
  const names: Record<string, string> = {
    dust2: "Dust 2",
    mirage: "Mirage",
    inferno: "Inferno",
    nuke: "Nuke",
    ancient: "Ancient",
    anubis: "Anubis",
    overpass: "Overpass",
    train: "Train",
  };
  return names[slug] ?? slug;
}
