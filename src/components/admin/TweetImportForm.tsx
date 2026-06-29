"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FrameTimelinePicker } from "@/components/admin/FrameTimelinePicker";
import type { GrenadeType, Map, Side, ThrowMethod } from "@/lib/types";
import {
  GRENADE_LABELS,
  GRENADE_TYPES,
  SIDE_LABELS,
  THROW_LABELS,
  THROW_METHODS,
} from "@/lib/constants";

interface PreviewFrame {
  index: number;
  timestampMs: number;
  dataUrl: string;
}

interface PreviewSuggested {
  title: string;
  map_slug: string | null;
  grenade_type: GrenadeType;
  side: Side;
  throw_method: ThrowMethod;
  site: string | null;
  notes: string | null;
}

interface PreviewResponse {
  tweetText: string;
  sourceUrl: string;
  suggested: PreviewSuggested;
  frames: PreviewFrame[];
}

interface TweetImportFormProps {
  maps: Map[];
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}

function resolveMapId(maps: Map[], slug: string | null): string {
  if (!slug) return maps[0]?.id ?? "";
  const match = maps.find((map) => map.slug === slug);
  return match?.id ?? maps[0]?.id ?? "";
}

export function TweetImportForm({ maps }: TweetImportFormProps) {
  const router = useRouter();
  const [tweetUrl, setTweetUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);

  const [title, setTitle] = useState("");
  const [mapId, setMapId] = useState(maps[0]?.id ?? "");
  const [grenadeType, setGrenadeType] = useState<GrenadeType>("smoke");
  const [side, setSide] = useState<Side>("T");
  const [throwMethod, setThrowMethod] = useState<ThrowMethod>("jump_throw");
  const [site, setSite] = useState("");
  const [notes, setNotes] = useState("");
  const [positionFrameIndex, setPositionFrameIndex] = useState<number | null>(null);
  const [aimFrameIndex, setAimFrameIndex] = useState<number | null>(null);

  async function handleFetch() {
    setError(null);
    setFetching(true);
    setPreview(null);
    setPositionFrameIndex(null);
    setAimFrameIndex(null);

    try {
      const response = await fetch("/api/import/tweet/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: tweetUrl }),
      });
      const data = (await response.json()) as PreviewResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch tweet preview");
      }

      setPreview(data);
      setTitle(data.suggested.title);
      setMapId(resolveMapId(maps, data.suggested.map_slug));
      setGrenadeType(data.suggested.grenade_type);
      setSide(data.suggested.side);
      setThrowMethod(data.suggested.throw_method);
      setSite(data.suggested.site ?? "");
      setNotes(
        data.suggested.notes
          ? `${data.suggested.notes}\n\nSource: ${data.sourceUrl}`
          : `Source: ${data.sourceUrl}`,
      );
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "Failed to fetch tweet",
      );
    } finally {
      setFetching(false);
    }
  }

  async function handlePublish() {
    if (!preview) return;
    if (positionFrameIndex === null || aimFrameIndex === null) {
      setError("Select both a position frame and an aim frame before publishing.");
      return;
    }

    const positionFrame = preview.frames.find((f) => f.index === positionFrameIndex);
    const aimFrame = preview.frames.find((f) => f.index === aimFrameIndex);
    if (!positionFrame || !aimFrame) {
      setError("Selected frames are no longer available.");
      return;
    }

    setError(null);
    setPublishing(true);

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("map_id", mapId);
      formData.set("grenade_type", grenadeType);
      formData.set("side", side);
      formData.set("throw_method", throwMethod);
      if (site.trim()) formData.set("site", site.trim());
      if (notes.trim()) formData.set("notes", notes.trim());
      formData.set(
        "position_image",
        dataUrlToFile(positionFrame.dataUrl, "position.jpg"),
      );
      formData.set("aim_image", dataUrlToFile(aimFrame.dataUrl, "aim.jpg"));

      const response = await fetch("/api/lineups", { method: "POST", body: formData });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create lineup");
      }

      router.push("/admin");
      router.refresh();
    } catch (publishError) {
      setError(
        publishError instanceof Error ? publishError.message : "Failed to publish lineup",
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <Field label="Tweet URL">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="url"
              value={tweetUrl}
              onChange={(e) => setTweetUrl(e.target.value)}
              placeholder="https://x.com/NadesOutHere/status/..."
              className={inputClass}
            />
            <button
              type="button"
              onClick={handleFetch}
              disabled={fetching || !tweetUrl.trim()}
              className="shrink-0 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-700 disabled:opacity-50"
            >
              {fetching ? "Fetching..." : "Fetch preview"}
            </button>
          </div>
        </Field>
      </section>

      {preview && (
        <>
          {preview.tweetText && (
            <section className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Tweet text
              </p>
              <p className="mt-2 text-sm text-zinc-300">{preview.tweetText}</p>
            </section>
          )}

          <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Map">
                <select
                  value={mapId}
                  onChange={(e) => setMapId(e.target.value)}
                  required
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
                  value={grenadeType}
                  onChange={(e) => setGrenadeType(e.target.value as GrenadeType)}
                  required
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
                  value={side}
                  onChange={(e) => setSide(e.target.value as Side)}
                  required
                  className={inputClass}
                >
                  {(Object.keys(SIDE_LABELS) as Side[]).map((s) => (
                    <option key={s} value={s}>
                      {SIDE_LABELS[s]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Throw method">
                <select
                  value={throwMethod}
                  onChange={(e) => setThrowMethod(e.target.value as ThrowMethod)}
                  required
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
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className={inputClass}
                  placeholder="A, B, Mid..."
                />
              </Field>
            </div>

            <Field label="Notes (optional)">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={inputClass}
              />
            </Field>
          </section>

          <FrameTimelinePicker
            frames={preview.frames}
            positionFrameIndex={positionFrameIndex}
            aimFrameIndex={aimFrameIndex}
            onPositionChange={setPositionFrameIndex}
            onAimChange={setAimFrameIndex}
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-400 disabled:opacity-50"
            >
              {publishing ? "Publishing..." : "Publish lineup"}
            </button>
            <Link
              href="/admin"
              className="rounded-lg px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </Link>
          </div>
        </>
      )}

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}
    </div>
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

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/30";
