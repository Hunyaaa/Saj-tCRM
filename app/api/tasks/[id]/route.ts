import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { status: "open" | "done" };
  const completedAt = body.status === "done" ? new Date().toISOString() : null;
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .update({ status: body.status, completed_at: completedAt })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
