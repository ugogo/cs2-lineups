import Link from "next/link";
import { Pencil } from "lucide-react";
import type { LineupWithMap } from "@/lib/types";
import { SOURCE_LABELS } from "@/lib/constants";
import { GrenadeBadge, SideBadge, SiteBadge, TagBadge } from "./Badges";
import { RelatedLineups } from "./Collections";
import { LineupBriefingViewer } from "./LineupBriefingViewer";
import { throwLabel } from "@/lib/grenade-styles";
import {
  filterLineups,
  getAdjacentLineupIds,
  parseLineupFilters,
} from "@/lib/lineup-filters";
import { getRelatedLineups } from "@/lib/lineup-tags";
import type { Lineup } from "@/lib/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LineupDetailProps {
  lineup: LineupWithMap;
  mapLineups: Lineup[];
  searchParams: Record<string, string | string[] | undefined>;
  isAdmin?: boolean;
}

export function LineupDetail({
  lineup,
  mapLineups,
  searchParams,
  isAdmin = false,
}: LineupDetailProps) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") params.set(key, value);
  }

  const filters = parseLineupFilters(params);
  const filtered = filterLineups(mapLineups, filters);
  const navigationPool =
    filtered.some((entry) => entry.id === lineup.id) ? filtered : mapLineups;
  const { prevId, nextId } = getAdjacentLineupIds(
    navigationPool,
    lineup.id,
  );
  const relatedLineups = getRelatedLineups(lineup, mapLineups);

  return (
    <div className="space-y-10">
    <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-10">
      <aside className="order-2 space-y-6 lg:sticky lg:top-20 lg:order-1 lg:self-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>Maps</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={`/maps/${lineup.maps.slug}`} />}>
                {lineup.maps.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {lineup.site && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-mono text-xs">
                    {lineup.site}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-3">
          <h1 className="font-heading text-2xl uppercase leading-tight tracking-wide sm:text-3xl">
            {lineup.title}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            <GrenadeBadge type={lineup.grenade_type} />
            <SideBadge side={lineup.side} />
            {lineup.site && <SiteBadge site={lineup.site} />}
            {lineup.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          {isAdmin && (
            <Link
              href={`/admin/lineups/${lineup.id}/edit`}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5",
              )}
            >
              <Pencil className="size-3.5" aria-hidden="true" />
              Edit lineup
            </Link>
          )}
        </div>

        <Card size="sm" className="border-primary/20 bg-primary/5 ring-primary/10">
          <CardContent className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
              Throw method
            </p>
            <p className="font-medium text-foreground">
              {throwLabel(lineup.throw_method)}
            </p>
          </CardContent>
        </Card>

        {lineup.notes && (
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              Notes
            </p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {lineup.notes}
            </p>
          </div>
        )}

        {lineup.source_type === "twitter" && lineup.source_url && (
          <>
            <div className="h-px bg-border/50" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">
              Source:{" "}
              <a
                href={lineup.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {SOURCE_LABELS.twitter}
              </a>
            </p>
          </>
        )}
      </aside>

      <div className="order-1 lg:order-2">
        <LineupBriefingViewer
          title={lineup.title}
          positionSrc={lineup.position_image_url}
          aimSrc={lineup.aim_image_url}
          prevId={prevId}
          nextId={nextId}
          filters={filters}
        />
      </div>
    </div>

    <RelatedLineups
      lineups={relatedLineups}
      mapSlug={lineup.maps.slug}
      filters={filters}
    />
    </div>
  );
}
