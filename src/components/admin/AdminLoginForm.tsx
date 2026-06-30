"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Invalid password");
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Invalid password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
      <div className="space-y-2">
        <Label htmlFor="admin-password">Admin password</Label>
        <Input
          id="admin-password"
          type="password"
          name="password"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "admin-password-error" : undefined}
        />
      </div>
      {error && (
        <p id="admin-password-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
