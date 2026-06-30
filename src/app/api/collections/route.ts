import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { revalidateCollectionCaches } from "@/lib/cache-tags";
import { slugifyCollectionName } from "@/lib/lineup-tags";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    const supabase = createAdminClient();
    const { data: collection, error } = await supabase
      .from("collections")
      .insert({ name, slug, description })
      .select("id, slug")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (lineupIds.length > 0) {
      const { error: membershipError } = await supabase
        .from("collection_lineups")
        .insert(
          lineupIds.map((lineup_id, index) => ({
            collection_id: collection.id,
            lineup_id,
            sort_order: index,
          })),
        );

      if (membershipError) {
        await supabase.from("collections").delete().eq("id", collection.id);
        return NextResponse.json({ error: membershipError.message }, { status: 500 });
      }
    }

    revalidateCollectionCaches(collection.slug);
    return NextResponse.json({ id: collection.id, slug: collection.slug });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create collection";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
