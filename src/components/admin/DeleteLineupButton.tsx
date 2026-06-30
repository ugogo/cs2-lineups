"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DeleteLineupButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this lineup? This cannot be undone.")) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/lineups/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      router.refresh();
    } catch {
      alert("Failed to delete lineup");
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
