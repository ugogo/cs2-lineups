import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { revalidateCollectionCaches } from "@/lib/cache-tags";
import { slugifyCollectionName } from "@/lib/lineup-tags";
import { createAdminClient } from "@/lib/supabase/admin";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const supabase = createAdminClient();
    const { data: existing, error: fetchError } = await supabase
      .from("collections")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();
    const description = ((formData.get("description") as string) || "").trim() || null;
    const lineupIds = formData.getAll("lineup_ids").map(String);

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = slugifyCollectionName(name);
    if (!slug) {
      return NextResponse.json({ error: "Invalid collection name" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("collections")
      .update({ name, slug, description })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const { error: deleteError } = await supabase
      .from("collection_lineups")
      .delete()
      .eq("collection_id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    if (lineupIds.length > 0) {
      const { error: membershipError } = await supabase
        .from("collection_lineups")
        .insert(
          lineupIds.map((lineup_id, index) => ({
            collection_id: id,
            lineup_id,
            sort_order: index,
          })),
        );

      if (membershipError) {
        return NextResponse.json({ error: membershipError.message }, { status: 500 });
      }
    }

    revalidateCollectionCaches(slug);
    if (existing.slug !== slug) {
      revalidateCollectionCaches(existing.slug);
    }

    return NextResponse.json({ id, slug });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update collection";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const supabase = createAdminClient();
    const { data: existing, error: fetchError } = await supabase
      .from("collections")
      .select("slug")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    const { error } = await supabase.from("collections").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidateCollectionCaches(existing.slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete collection";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
