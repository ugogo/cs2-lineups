"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LineupImage } from "@/components/LineupImage";
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
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-400 disabled:opacity-50"
        >
          {loading ? "Saving..." : initial ? "Update lineup" : "Create lineup"}
        </button>
        <Link
          href="/admin"
          className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
        >
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
      <span className="text-sm font-medium text-zinc-300">{label}</span>
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
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      {currentUrl && (
        <div className="aspect-video overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
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
        className="block w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:text-zinc-200 hover:file:bg-zinc-700"
      />
      {currentUrl && (
        <p className="text-xs text-zinc-500">
          Leave empty to keep the current image.
        </p>
      )}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30";
