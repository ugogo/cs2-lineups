import { Suspense } from "react";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

interface AdminLoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  return (
    <Suspense fallback={<AdminLoginSkeleton />}>
      <AdminLoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminLoginContent({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md space-y-6 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-100">Admin login</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Enter your password to manage lineups.
        </p>
      </div>
      <AdminLoginForm nextPath={next ?? "/admin"} />
      <p className="text-center">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← Back to maps
        </Link>
      </p>
    </div>
  );
}

function AdminLoginSkeleton() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-12 animate-pulse">
      <div className="text-center">
        <div className="mx-auto h-8 w-40 rounded bg-zinc-800" />
        <div className="mx-auto mt-2 h-4 w-56 rounded bg-zinc-800/60" />
      </div>
      <div className="h-32 rounded-xl bg-zinc-900/40" />
    </div>
  );
}
