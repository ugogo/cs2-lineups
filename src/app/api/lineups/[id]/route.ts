import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteLineupImage, uploadLineupImage } from "@/lib/storage";
import type { GrenadeType, Side, ThrowMethod } from "@/lib/types";

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
      .from("lineups")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Lineup not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const map_id = formData.get("map_id") as string;
    const grenade_type = formData.get("grenade_type") as GrenadeType;
    const side = formData.get("side") as Side;
    const throw_method = formData.get("throw_method") as ThrowMethod;
    const notes = (formData.get("notes") as string) || null;
    const site = (formData.get("site") as string) || null;
    const positionImage = formData.get("position_image") as File | null;
    const aimImage = formData.get("aim_image") as File | null;

    let position_image_url = existing.position_image_url;
    let aim_image_url = existing.aim_image_url;

    if (positionImage?.size) {
      await deleteLineupImage(existing.position_image_url);
      position_image_url = await uploadLineupImage(positionImage, "position");
    }

    if (aimImage?.size) {
      await deleteLineupImage(existing.aim_image_url);
      aim_image_url = await uploadLineupImage(aimImage, "aim");
    }

    const { error } = await supabase
      .from("lineups")
      .update({
        map_id,
        title,
        grenade_type,
        side,
        throw_method,
        notes,
        site,
        position_image_url,
        aim_image_url,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update lineup";
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
      .from("lineups")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Lineup not found" }, { status: 404 });
    }

    await Promise.all([
      deleteLineupImage(existing.position_image_url),
      deleteLineupImage(existing.aim_image_url),
    ]);

    const { error } = await supabase.from("lineups").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete lineup";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
