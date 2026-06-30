"use client";

import { useId } from "react";
import { LINEUP_TAG_LABELS, LINEUP_TAGS } from "@/lib/constants";
import type { LineupTag } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TagPickerProps {
  defaultTags?: LineupTag[];
}

export function TagPicker({ defaultTags = [] }: TagPickerProps) {
  const groupId = useId();
  const selected = new Set(defaultTags);

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium">Tags (optional)</legend>
      <div className="flex flex-wrap gap-2">
        {LINEUP_TAGS.map((tag) => (
          <label
            key={tag}
            htmlFor={`${groupId}-${tag}`}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-3 text-sm transition",
              "has-checked:border-primary/40 has-checked:bg-primary/10",
            )}
          >
            <input
              id={`${groupId}-${tag}`}
              type="checkbox"
              name="tags"
              value={tag}
              defaultChecked={selected.has(tag)}
              className="size-4 rounded border-input accent-primary"
            />
            {LINEUP_TAG_LABELS[tag]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
