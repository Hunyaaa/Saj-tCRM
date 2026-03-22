import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { NextResponse } from "next/server";

const admin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const contactId = (formData.get("contactId") as string | null) ?? null;
  const caseId = (formData.get("caseId") as string | null) ?? null;
  const category = (formData.get("category") as string | null) ?? "other";

  if (!file) {
    return NextResponse.json({ error: "Hiányzó fájl." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const path = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await admin.storage.from("documents").upload(path, buffer, {
    contentType: file.type,
    upsert: false
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { error: insertError } = await admin.from("documents").insert({
    contact_id: contactId,
    case_id: caseId,
    file_name: file.name,
    file_path: path,
    file_type: file.type || null,
    category: category as Database["public"]["Tables"]["documents"]["Row"]["category"]
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
