"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export function TaskForm() {
  const router = useRouter();
  const params = useSearchParams();

  async function onSubmit(formData: FormData) {
    const supabase = createClient();
    const payload = {
      contact_id: String(formData.get("contact_id") || "") || null,
      case_id: String(formData.get("case_id") || "") || null,
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || "") || null,
      due_date: String(formData.get("due_date") || ""),
      due_time: String(formData.get("due_time") || "") || null,
      status: "open" as const,
      priority: String(formData.get("priority") || "normal")
    };

    await supabase.from("tasks").insert(payload);
    router.push("/teendok");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid gap-3 md:grid-cols-2">
      <input name="title" required placeholder="Teendő címe" className="md:col-span-2" />
      <input name="contact_id" defaultValue={params.get("contactId") ?? ""} placeholder="Kapcsolat ID (opcionális)" />
      <input name="case_id" defaultValue={params.get("caseId") ?? ""} placeholder="Ügy ID (opcionális)" />
      <input name="due_date" type="date" required />
      <input name="due_time" type="time" />
      <select name="priority" defaultValue="normal">
        <option value="low">Alacsony</option>
        <option value="normal">Normál</option>
        <option value="high">Magas</option>
        <option value="urgent">Sürgős</option>
      </select>
      <textarea name="description" placeholder="Leírás" rows={3} className="md:col-span-2" />
      <Button type="submit" className="w-fit">Teendő mentése</Button>
    </form>
  );
}
