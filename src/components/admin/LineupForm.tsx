"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LineupImage } from "@/components/LineupImage";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GrenadeType, Map, Side, ThrowMethod } from "@/lib/types";
import {
  GRENADE_LABELS,
  GRENADE_TYPES,
  SIDE_LABELS,
  THROW_LABELS,
  THROW_METHODS,
} from "@/lib/constants";

interface LineupFormProps {
  maps: Map[];
  initial?: {
    id: string;
    map_id: string;
    title: string;
    grenade_type: GrenadeType;
    side: Side;
    throw_method: ThrowMethod;
    notes: string | null;
    site: string | null;
    position_image_url: string;
    aim_image_url: string;
  };
}

export function LineupForm({ maps, initial }: LineupFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const url = initial ? `/api/lineups/${initial.id}` : "/api/lineups";
      const method = initial ? "PUT" : "POST";

      const response = await fetch(url, { method, body: formData });
      const data = (await response.json()) as { error?: string; id?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save lineup");
      }

      router.push("/admin");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Failed to save",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            name="title"
            required
            defaultValue={initial?.title}
            className={inputClass}
            placeholder="Window smoke from T spawn"
          />
        </Field>
        <Field label="Map">
          <select
            name="map_id"
            required
            defaultValue={initial?.map_id}
            className={inputClass}
          >
            {maps.map((map) => (
              <option key={map.id} value={map.id}>
                {map.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Grenade type">
          <select
            name="grenade_type"
            required
            defaultValue={initial?.grenade_type ?? "smoke"}
            className={inputClass}
          >
            {GRENADE_TYPES.map((type) => (
              <option key={type} value={type}>
                {GRENADE_LABELS[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Side">
          <select
            name="side"
            required
            defaultValue={initial?.side ?? "T"}
            className={inputClass}
          >
            {(Object.keys(SIDE_LABELS) as Side[]).map((side) => (
              <option key={side} value={side}>
                {SIDE_LABELS[side]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Throw method">
          <select
            name="throw_method"
            required
            defaultValue={initial?.throw_method ?? "jump_throw"}
            className={inputClass}
          >
            {THROW_METHODS.map((method) => (
              <option key={method} value={method}>
                {THROW_LABELS[method]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Site (optional)">
          <input
            name="site"
            defaultValue={initial?.site ?? ""}
            className={inputClass}
            placeholder="A, B, Mid..."
          />
        </Field>
      </div>

      <Field label="Notes (optional)">
        <textarea
          name="notes"
          rows={3}
          defaultValue={initial?.notes ?? ""}
          className={inputClass}
          placeholder="Align crosshair with corner of the box..."
        />
      </Field>

      <div className="grid gap-6 lg:grid-cols-2">
        <ImageField
          label="Stand position screenshot"
          name="position_image"
          required={!initial}
          currentUrl={initial?.position_image_url}
        />
        <ImageField
          label="Aim reference screenshot"
          name="aim_image"
          required={!initial}
          currentUrl={initial?.aim_image_url}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initial ? "Update lineup" : "Create lineup"}
        </Button>
        <Link href="/admin" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function ImageField({
  label,
  name,
  required,
  currentUrl,
}: {
  label: string;
  name: string;
  required?: boolean;
  currentUrl?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {currentUrl && (
        <div className="aspect-video overflow-hidden rounded-lg border border-border bg-muted">
          <LineupImage
            src={currentUrl}
            alt="Current screenshot"
            className="object-contain"
          />
        </div>
      )}
      <input
        type="file"
        name={name}
        accept="image/*"
        required={required}
        className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:text-foreground hover:file:bg-muted/80"
      />
      {currentUrl && (
        <p className="text-xs text-muted-foreground">
          Leave empty to keep the current image.
        </p>
      )}
    </label>
  );
}

const inputClass =
  "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50";
