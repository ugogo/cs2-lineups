import { Suspense } from "react";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Admin login</CardTitle>
          <CardDescription>Enter your password to manage lineups.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm nextPath={next ?? "/admin"} />
        </CardContent>
      </Card>
      <p className="text-center">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to maps
        </Link>
      </p>
    </div>
  );
}

function AdminLoginSkeleton() {
  return (
    <div className="mx-auto max-w-md space-y-6 py-12 animate-pulse">
      <div className="h-48 rounded-xl bg-muted/40" />
    </div>
  );
}
