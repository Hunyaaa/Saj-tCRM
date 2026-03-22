"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function NoteForm({ contactId, caseId }: { contactId?: string; caseId?: string }) {
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    const supabase = createClient();
    await supabase.from("notes").insert({
      contact_id: contactId ?? null,
      case_id: caseId ?? null,
      content: String(formData.get("content") || ""),
      note_type: String(formData.get("note_type") || "general")
    });
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-2">
      <textarea required name="content" rows={3} placeholder="Új megjegyzés" className="w-full" />
      <div className="flex items-center gap-2">
        <select name="note_type" defaultValue="general">
          <option value="general">Általános</option>
          <option value="phone_call">Telefon</option>
          <option value="email">Email</option>
          <option value="insurer_update">Biztosítói frissítés</option>
          <option value="client_update">Ügyfél frissítés</option>
          <option value="internal">Belső</option>
        </select>
        <Button type="submit">Megjegyzés mentése</Button>
      </div>
    </form>
  );
}
