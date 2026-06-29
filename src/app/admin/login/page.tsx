import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

interface AdminLoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
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
