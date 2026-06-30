"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { LineupImage } from "@/components/LineupImage";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TagPicker } from "@/components/admin/TagPicker";
import type { GrenadeType, LineupTag, Map, Side, ThrowMethod } from "@/lib/types";
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
    tags?: LineupTag[];
    position_image_url: string;
    aim_image_url: string;
  };
}

export function LineupForm({ maps, initial }: LineupFormProps) {
  const router = useRouter();
  const formId = useId();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const titleId = `${formId}-title`;
  const mapId = `${formId}-map`;
  const grenadeId = `${formId}-grenade`;
  const sideId = `${formId}-side`;
  const throwId = `${formId}-throw`;
  const siteId = `${formId}-site`;
  const notesId = `${formId}-notes`;
  const positionImageId = `${formId}-position-image`;
  const aimImageId = `${formId}-aim-image`;

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
        <Field label="Title" htmlFor={titleId}>
          <Input
            id={titleId}
            name="title"
            required
            defaultValue={initial?.title}
            placeholder="Window smoke from T spawn"
          />
        </Field>
        <Field label="Map" htmlFor={mapId}>
          <select
            id={mapId}
            name="map_id"
            required
            defaultValue={initial?.map_id}
            className={fieldClass}
          >
            {maps.map((map) => (
              <option key={map.id} value={map.id}>
                {map.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Grenade type" htmlFor={grenadeId}>
          <select
            id={grenadeId}
            name="grenade_type"
            required
            defaultValue={initial?.grenade_type ?? "smoke"}
            className={fieldClass}
          >
            {GRENADE_TYPES.map((type) => (
              <option key={type} value={type}>
                {GRENADE_LABELS[type]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Side" htmlFor={sideId}>
          <select
            id={sideId}
            name="side"
            required
            defaultValue={initial?.side ?? "T"}
            className={fieldClass}
          >
            {(Object.keys(SIDE_LABELS) as Side[]).map((side) => (
              <option key={side} value={side}>
                {SIDE_LABELS[side]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Throw method" htmlFor={throwId}>
          <select
            id={throwId}
            name="throw_method"
            required
            defaultValue={initial?.throw_method ?? "jump_throw"}
            className={fieldClass}
          >
            {THROW_METHODS.map((method) => (
              <option key={method} value={method}>
                {THROW_LABELS[method]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Site (optional)" htmlFor={siteId}>
          <Input
            id={siteId}
            name="site"
            defaultValue={initial?.site ?? ""}
            placeholder="A, B, Mid..."
          />
        </Field>
      </div>

      <Field label="Notes (optional)" htmlFor={notesId}>
        <textarea
          id={notesId}
          name="notes"
          rows={3}
          defaultValue={initial?.notes ?? ""}
          className={cn(fieldClass, "min-h-20 py-2")}
          placeholder="Align crosshair with corner of the box..."
        />
      </Field>

      <TagPicker defaultTags={initial?.tags} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ImageField
          label="Stand position screenshot"
          htmlFor={positionImageId}
          name="position_image"
          required={!initial}
          currentUrl={initial?.position_image_url}
        />
        <ImageField
          label="Aim reference screenshot"
          htmlFor={aimImageId}
          name="aim_image"
          required={!initial}
          currentUrl={initial?.aim_image_url}
        />
      </div>

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
          {loading ? "Saving..." : initial ? "Update lineup" : "Create lineup"}
        </Button>
        <Link
          href="/admin"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function ImageField({
  label,
  htmlFor,
  name,
  required,
  currentUrl,
}: {
  label: string;
  htmlFor: string;
  name: string;
  required?: boolean;
  currentUrl?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {currentUrl && (
        <div className="aspect-video overflow-hidden rounded-lg border border-border bg-muted">
          <LineupImage
            src={currentUrl}
            alt="Current screenshot"
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      )}
      <Input
        id={htmlFor}
        type="file"
        name={name}
        accept="image/*"
        required={required}
        className="file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:text-foreground hover:file:bg-muted/80"
      />
      {currentUrl && (
        <p className="text-xs text-muted-foreground">
          Leave empty to keep the current image.
        </p>
      )}
    </div>
  );
}

const fieldClass =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80";
