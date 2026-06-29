"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface TimelineFrame {
  index: number;
  timestampMs: number;
  dataUrl: string;
}

interface FrameTimelinePickerProps {
  frames: TimelineFrame[];
  positionFrameIndex: number | null;
  aimFrameIndex: number | null;
  onPositionChange: (index: number) => void;
  onAimChange: (index: number) => void;
}

function formatTime(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(2).padStart(5, "0")}`;
  }
  return `${seconds.toFixed(2)}s`;
}

function framePercent(index: number, frameCount: number): number {
  if (frameCount <= 1) return 0;
  return (index / (frameCount - 1)) * 100;
}

export function FrameTimelinePicker({
  frames,
  positionFrameIndex,
  aimFrameIndex,
  onPositionChange,
  onAimChange,
}: FrameTimelinePickerProps) {
  const [scrubIndex, setScrubIndex] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);

  const currentFrame = frames[scrubIndex] ?? frames[0];
  const positionFrame =
    positionFrameIndex !== null
      ? frames.find((frame) => frame.index === positionFrameIndex)
      : null;
  const aimFrame =
    aimFrameIndex !== null ? frames.find((frame) => frame.index === aimFrameIndex) : null;

  const scrollFilmstripToIndex = useCallback((index: number) => {
    const container = filmstripRef.current;
    const thumb = container?.querySelector(`[data-frame-index="${index}"]`);
    if (container && thumb instanceof HTMLElement) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, []);

  useEffect(() => {
    scrollFilmstripToIndex(scrubIndex);
  }, [scrubIndex, scrollFilmstripToIndex]);

  function handleTimelineClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect || frames.length === 0) return;

    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const index = Math.round(ratio * (frames.length - 1));
    setScrubIndex(index);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (frames.length === 0) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setScrubIndex((prev) => Math.max(0, prev - 1));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setScrubIndex((prev) => Math.min(frames.length - 1, prev + 1));
    } else if (event.key === "p" || event.key === "P") {
      onPositionChange(scrubIndex);
    } else if (event.key === "a" || event.key === "A") {
      onAimChange(scrubIndex);
    }
  }

  if (!currentFrame) return null;

  return (
    <section className="space-y-5" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-zinc-300">Frame picker</h3>
          <p className="text-xs text-zinc-500">
            Scrub the timeline, then set stand position and aim reference. Arrow keys
            scrub; P / A set markers.
          </p>
        </div>
        <span className="rounded-md bg-zinc-800 px-2.5 py-1 font-mono text-xs text-zinc-300">
          {formatTime(currentFrame.timestampMs)}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentFrame.dataUrl}
          alt={`Preview at ${formatTime(currentFrame.timestampMs)}`}
          className="aspect-video w-full object-contain"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onPositionChange(scrubIndex)}
          className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
        >
          Set stand position here
        </button>
        <button
          type="button"
          onClick={() => onAimChange(scrubIndex)}
          className="rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-sm font-medium text-green-300 transition hover:bg-green-500/20"
        >
          Set aim reference here
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <SelectionCard
          label="Stand position"
          accent="blue"
          frame={positionFrame ?? null}
          placeholder="Not set — scrub and click “Set stand position here”"
        />
        <SelectionCard
          label="Aim reference"
          accent="green"
          frame={aimFrame ?? null}
          placeholder="Not set — scrub and click “Set aim reference here”"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{formatTime(frames[0]?.timestampMs ?? 0)}</span>
          <span>Timeline</span>
          <span>{formatTime(frames[frames.length - 1]?.timestampMs ?? 0)}</span>
        </div>

        <div
          ref={timelineRef}
          role="slider"
          aria-label="Video timeline"
          aria-valuemin={0}
          aria-valuemax={frames.length - 1}
          aria-valuenow={scrubIndex}
          onClick={handleTimelineClick}
          className="relative h-12 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-950"
        >
          <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-zinc-800" />

          {positionFrameIndex !== null && (
            <TimelineMarker
              percent={framePercent(positionFrameIndex, frames.length)}
              color="blue"
              label="Pos"
            />
          )}
          {aimFrameIndex !== null && (
            <TimelineMarker
              percent={framePercent(aimFrameIndex, frames.length)}
              color="green"
              label="Aim"
            />
          )}

          <div
            className="absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-orange-500 shadow-lg"
            style={{ left: `${framePercent(scrubIndex, frames.length)}%` }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={Math.max(0, frames.length - 1)}
          value={scrubIndex}
          onChange={(event) => setScrubIndex(Number(event.target.value))}
          className="w-full accent-orange-500"
          aria-label="Scrub through frames"
        />
      </div>

      <div
        ref={filmstripRef}
        className="flex gap-2 overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950 p-2"
      >
        {frames.map((frame) => {
          const isScrub = frame.index === scrubIndex;
          const isPosition = frame.index === positionFrameIndex;
          const isAim = frame.index === aimFrameIndex;

          return (
            <button
              key={frame.index}
              type="button"
              data-frame-index={frame.index}
              onClick={() => setScrubIndex(frame.index)}
              className={`relative shrink-0 overflow-hidden rounded-md border-2 transition ${
                isScrub
                  ? "border-orange-500 ring-2 ring-orange-500/30"
                  : isPosition
                    ? "border-blue-500"
                    : isAim
                      ? "border-green-500"
                      : "border-zinc-800 hover:border-zinc-600"
              }`}
              title={formatTime(frame.timestampMs)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={frame.dataUrl}
                alt=""
                className="h-14 w-24 object-cover"
              />
              <span className="absolute bottom-0 left-0 right-0 bg-black/75 px-1 py-0.5 text-center font-mono text-[9px] text-zinc-300">
                {formatTime(frame.timestampMs)}
              </span>
              {(isPosition || isAim) && (
                <div className="absolute left-1 top-1 flex gap-0.5">
                  {isPosition && (
                    <span className="rounded bg-blue-600 px-1 py-0.5 text-[8px] font-medium text-white">
                      P
                    </span>
                  )}
                  {isAim && (
                    <span className="rounded bg-green-600 px-1 py-0.5 text-[8px] font-medium text-white">
                      A
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TimelineMarker({
  percent,
  color,
  label,
}: {
  percent: number;
  color: "blue" | "green";
  label: string;
}) {
  const colorClass =
    color === "blue"
      ? "border-blue-400 bg-blue-500 text-blue-100"
      : "border-green-400 bg-green-500 text-green-100";

  return (
    <div
      className="absolute top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${percent}%` }}
    >
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full border text-[8px] font-bold ${colorClass}`}
      >
        {label[0]}
      </div>
    </div>
  );
}

function SelectionCard({
  label,
  accent,
  frame,
  placeholder,
}: {
  label: string;
  accent: "blue" | "green";
  frame: TimelineFrame | null;
  placeholder: string;
}) {
  const borderClass =
    accent === "blue" ? "border-blue-500/30 bg-blue-500/5" : "border-green-500/30 bg-green-500/5";

  return (
    <div className={`rounded-lg border p-3 ${borderClass}`}>
      <p className="text-xs font-medium text-zinc-400">{label}</p>
      {frame ? (
        <div className="mt-2 flex items-center gap-3">
          <div className="overflow-hidden rounded-md border border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frame.dataUrl} alt="" className="h-16 w-28 object-cover" />
          </div>
          <span className="font-mono text-sm text-zinc-300">
            {formatTime(frame.timestampMs)}
          </span>
        </div>
      ) : (
        <p className="mt-2 text-xs text-zinc-500">{placeholder}</p>
      )}
    </div>
  );
}
