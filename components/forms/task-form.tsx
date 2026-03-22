"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];

export function TaskForm({
  contacts,
  cases
}: {
  contacts: Array<{ id: string; full_name: string }>;
  cases: Array<{ id: string; case_number: string; title: string }>;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const title = String(formData.get("title") || "").trim();
    const dueDate = String(formData.get("due_date") || "").trim();

    if (!title || !dueDate) {
      setError("A cím és a határidő kötelező.");
      setLoading(false);
      return;
    }

    const payload: TaskInsert = {
      contact_id: String(formData.get("contact_id") || "").trim() || null,
      case_id: String(formData.get("case_id") || "").trim() || null,
      title,
      description: String(formData.get("description") || "").trim() || null,
      due_date: dueDate,
      due_time: String(formData.get("due_time") || "").trim() || null,
      status: "open",
      priority: String(formData.get("priority") || "normal") as TaskInsert["priority"]
    };

    const supabase = createClient();
    const { error } = await supabase.from("tasks").insert(payload);
    if (error) {
      setError(`Mentési hiba: ${error.message}`);
      setLoading(false);
      return;
    }

    router.push("/teendok");
    router.refresh();
    setLoading(false);
  }

  return (
    <form action={onSubmit} className="grid gap-3 md:grid-cols-2">
      <input name="title" required placeholder="Teendő címe" className="md:col-span-2" />
      <select name="contact_id" defaultValue={params.get("contactId") ?? ""}>
        <option value="">Nincs kapcsolathoz kötve</option>
        {contacts.map((contact) => (
          <option key={contact.id} value={contact.id}>{contact.full_name}</option>
        ))}
      </select>
      <select name="case_id" defaultValue={params.get("caseId") ?? ""}>
        <option value="">Nincs ügyhöz kötve</option>
        {cases.map((item) => (
          <option key={item.id} value={item.id}>{item.case_number} – {item.title}</option>
        ))}
      </select>
      <input name="due_date" type="date" required />
      <input name="due_time" type="time" />
      <select name="priority" defaultValue="normal">
        <option value="low">Alacsony</option>
        <option value="normal">Normál</option>
        <option value="high">Magas</option>
        <option value="urgent">Sürgős</option>
      </select>
      <textarea name="description" placeholder="Leírás" rows={3} className="md:col-span-2" />
      {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="w-fit" disabled={loading}>{loading ? "Mentés..." : "Teendő mentése"}</Button>
    </form>
  );
}
