"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { LineupWithMap } from "@/lib/types";

interface CollectionFormProps {
  lineups: LineupWithMap[];
  initial?: {
    id: string;
    name: string;
    description: string | null;
    lineup_ids: string[];
  };
}

export function CollectionForm({ lineups, initial }: CollectionFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const selectedIds = new Set(initial?.lineup_ids ?? []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const url = initial ? `/api/collections/${initial.id}` : "/api/collections";
      const method = initial ? "PUT" : "POST";
      const response = await fetch(url, { method, body: formData });
      const data = (await response.json()) as { error?: string; slug?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save collection");
      }

      router.push(data.slug ? `/collections/${data.slug}` : "/admin/collections");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Failed to save",
      );
    } finally {
      setLoading(false);
    }
  }

  const lineupsByMap = groupLineupsByMap(lineups);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="collection-name">Name</Label>
          <Input
            id="collection-name"
            name="name"
            required
            defaultValue={initial?.name}
            placeholder="Mirage A execute"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="collection-description">Description (optional)</Label>
          <textarea
            id="collection-description"
            name="description"
            rows={3}
            defaultValue={initial?.description ?? ""}
            className={cn(fieldClass, "min-h-20 py-2")}
            placeholder="Smokes and flashes for a full A site hit..."
          />
        </div>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Lineups in this pack</legend>
        {lineupsByMap.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No lineups yet.{" "}
            <Link href="/admin/lineups/new" className="text-primary hover:underline">
              Add one first
            </Link>
            .
          </p>
        ) : (
          lineupsByMap.map(({ mapName, entries }) => (
            <div key={mapName} className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                {mapName}
              </p>
              <div className="space-y-2 rounded-xl border border-border/60 p-3">
                {entries.map((lineup) => (
                  <label
                    key={lineup.id}
                    className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/40"
                  >
                    <input
                      type="checkbox"
                      name="lineup_ids"
                      value={lineup.id}
                      defaultChecked={selectedIds.has(lineup.id)}
                      className="mt-1 size-4 rounded border-input accent-primary"
                    />
                    <span>
                      <span className="font-medium text-foreground">{lineup.title}</span>
                      <span className="mt-0.5 block font-mono text-xs text-muted-foreground">
                        {lineup.grenade_type}
                        {lineup.site ? ` · ${lineup.site}` : ""}
                        {` · ${lineup.side}`}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
      </fieldset>

      {error && (
        <p
          className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initial ? "Update pack" : "Create pack"}
        </Button>
        <Link
          href="/admin/collections"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function groupLineupsByMap(lineups: LineupWithMap[]) {
  const groups = new globalThis.Map<string, LineupWithMap[]>();

  for (const lineup of lineups) {
    const mapName = lineup.maps.name;
    const bucket = groups.get(mapName) ?? [];
    bucket.push(lineup);
    groups.set(mapName, bucket);
  }

  return [...groups.entries()].map(([mapName, entries]) => ({ mapName, entries }));
}

const fieldClass =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80";
