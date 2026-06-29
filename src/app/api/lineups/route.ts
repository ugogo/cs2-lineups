import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadLineupImage } from "@/lib/storage";
import type { GrenadeType, Side, ThrowMethod } from "@/lib/types";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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

    if (!title || !map_id || !positionImage?.size || !aimImage?.size) {
      return NextResponse.json(
        { error: "Missing required fields or images" },
        { status: 400 },
      );
    }

    const [position_image_url, aim_image_url] = await Promise.all([
      uploadLineupImage(positionImage, "position"),
      uploadLineupImage(aimImage, "aim"),
    ]);

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("lineups")
      .insert({
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
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create lineup";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
