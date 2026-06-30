"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DeleteCollectionButtonProps {
  id: string;
  name: string;
}

export function DeleteCollectionButton({ id, name }: DeleteCollectionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete pack "${name}"? This cannot be undone.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/collections/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to delete collection");
      }
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-destructive hover:text-destructive"
    >
      {loading ? "Deleting..." : "Delete"}
    </Button>
  );
}
