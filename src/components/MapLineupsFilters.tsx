"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { GrenadeIcon } from "@/components/icons/GrenadeIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  GRENADE_LABELS,
  GRENADE_TYPES,
  SIDE_LABELS,
  THROW_LABELS,
  THROW_METHODS,
} from "@/lib/constants";
import {
  GRENADE_FILTER_ACTIVE_CLASS,
  SIDE_FILTER_ACTIVE_CLASS,
} from "@/lib/grenade-styles";
import { parseLineupFilters } from "@/lib/lineup-filters";
import type { GrenadeType, Side, ThrowMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MapLineupsFiltersProps {
  mapSlug: string;
  sites: string[];
}

const FILTER_TOGGLE_CLASS =
  "min-h-11 border border-border/60 bg-card/50 px-3 data-[state=on]:border-transparent";

export function MapLineupsFilters({ mapSlug, sites }: MapLineupsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = parseLineupFilters(searchParams);
  const [throwFiltersOpen, setThrowFiltersOpen] = useState(
    () => filters.throw !== null,
  );

  useEffect(() => {
    if (filters.throw) {
      setThrowFiltersOpen(true);
    }
  }, [filters.throw]);

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.replace(query ? `/maps/${mapSlug}?${query}` : `/maps/${mapSlug}`, {
      scroll: false,
    });
  }

  function clearFilters() {
    router.replace(`/maps/${mapSlug}`, { scroll: false });
  }

  const active =
    filters.grenade !== null ||
    filters.side !== null ||
    filters.throw !== null ||
    filters.site !== null;

  return (
    <div className="sticky top-12 z-30 -mx-4 border-b border-border/50 bg-background/90 px-4 py-3 backdrop-blur-md">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup
            value={filters.grenade ? [filters.grenade] : []}
            onValueChange={(values) => {
              const next = values.at(-1) as GrenadeType | undefined;
              setFilter("grenade", next ?? null);
            }}
            className="flex flex-wrap justify-start gap-1.5"
          >
            {GRENADE_TYPES.map((type) => (
              <ToggleGroupItem
                key={type}
                value={type}
                aria-label={GRENADE_LABELS[type]}
                className={cn(
                  "gap-1.5",
                  FILTER_TOGGLE_CLASS,
                  GRENADE_FILTER_ACTIVE_CLASS[type],
                )}
              >
                <GrenadeIcon type={type} className="size-3.5" />
                <span className="hidden sm:inline">{GRENADE_LABELS[type]}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="hidden h-8 w-px bg-border/60 sm:block" aria-hidden="true" />

          <ToggleGroup
            value={filters.side ? [filters.side] : []}
            onValueChange={(values) => {
              const next = values.at(-1) as Side | undefined;
              setFilter("side", next ?? null);
            }}
            className="gap-1.5"
          >
            {(Object.keys(SIDE_LABELS) as Side[]).map((side) => (
              <ToggleGroupItem
                key={side}
                value={side}
                className={cn(
                  "font-mono text-xs",
                  FILTER_TOGGLE_CLASS,
                  SIDE_FILTER_ACTIVE_CLASS[side],
                )}
              >
                {side}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {sites.length > 0 && (
            <>
              <div className="hidden h-8 w-px bg-border/60 sm:block" aria-hidden="true" />
              <ToggleGroup
                value={filters.site ? [filters.site] : []}
                onValueChange={(values) => {
                  const next = values.at(-1);
                  setFilter("site", next ?? null);
                }}
                className="flex flex-wrap gap-1.5"
              >
                {sites.map((site) => (
                  <ToggleGroupItem
                    key={site}
                    value={site}
                    className={cn(
                      "font-mono text-xs data-[state=on]:bg-primary/20 data-[state=on]:text-primary",
                      FILTER_TOGGLE_CLASS,
                    )}
                  >
                    {site}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </>
          )}
        </div>

        <Collapsible open={throwFiltersOpen} onOpenChange={setThrowFiltersOpen}>
          <CollapsibleTrigger className="flex min-h-11 items-center gap-2 rounded-lg px-2 font-mono text-xs uppercase tracking-wide text-muted-foreground transition hover:text-foreground">
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                throwFiltersOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
            Throw method
            {filters.throw && (
              <Badge variant="secondary" className="font-normal normal-case">
                {THROW_LABELS[filters.throw]}
              </Badge>
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <ToggleGroup
              value={filters.throw ? [filters.throw] : []}
              onValueChange={(values) => {
                const next = values.at(-1) as ThrowMethod | undefined;
                setFilter("throw", next ?? null);
              }}
              className="flex flex-wrap gap-1.5"
            >
              {THROW_METHODS.map((method) => (
                <ToggleGroupItem
                  key={method}
                  value={method}
                  className={cn(
                    "font-mono text-xs data-[state=on]:bg-primary/20 data-[state=on]:text-primary",
                    FILTER_TOGGLE_CLASS,
                  )}
                >
                  {THROW_LABELS[method]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </CollapsibleContent>
        </Collapsible>

        {active && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.grenade && (
              <ActiveFilterChip
                label={GRENADE_LABELS[filters.grenade]}
                onRemove={() => setFilter("grenade", null)}
              />
            )}
            {filters.side && (
              <ActiveFilterChip
                label={SIDE_LABELS[filters.side]}
                onRemove={() => setFilter("side", null)}
              />
            )}
            {filters.throw && (
              <ActiveFilterChip
                label={THROW_LABELS[filters.throw]}
                onRemove={() => setFilter("throw", null)}
              />
            )}
            {filters.site && (
              <ActiveFilterChip
                label={filters.site}
                onRemove={() => setFilter("site", null)}
              />
            )}
            <Button
              variant="ghost"
              size="xs"
              onClick={clearFilters}
              className="min-h-11 text-muted-foreground"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="min-h-6 min-w-6 rounded-full p-0.5 hover:bg-muted"
        aria-label={`Remove ${label} filter`}
      >
        <X className="size-3" />
      </button>
    </Badge>
  );
}
