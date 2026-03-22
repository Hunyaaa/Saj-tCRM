"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { caseTypeLabels, statusLabels } from "@/lib/utils/labels";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function CaseForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const supabase = createClient();

    const payload = {
      contact_id: String(formData.get("contact_id") || ""),
      case_number: String(formData.get("case_number") || ""),
      title: String(formData.get("title") || ""),
      case_type: String(formData.get("case_type") || "other"),
      insurer: String(formData.get("insurer") || "") || null,
      claim_number: String(formData.get("claim_number") || "") || null,
      vehicle_plate: String(formData.get("vehicle_plate") || "") || null,
      vin: String(formData.get("vin") || "") || null,
      event_date: String(formData.get("event_date") || "") || null,
      status: String(formData.get("status") || "new"),
      priority: String(formData.get("priority") || "normal"),
      summary: String(formData.get("summary") || "") || null
    };

    const { data } = await supabase.from("cases").insert(payload).select("id").single();
    router.push(`/ugyek/${data?.id ?? ""}`);
    router.refresh();
    setLoading(false);
  }

  return (
    <form action={onSubmit} className="grid gap-3 md:grid-cols-2">
      <input name="contact_id" required defaultValue={params.get("contactId") ?? ""} placeholder="Kapcsolat ID" />
      <input name="case_number" required placeholder="Ügyszám" />
      <input name="title" required placeholder="Ügy címe" className="md:col-span-2" />
      <select name="case_type" defaultValue="vehicle_damage">
        {Object.entries(caseTypeLabels).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <select name="status" defaultValue="new">
        {Object.entries(statusLabels).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <select name="priority" defaultValue="normal">
        <option value="low">Alacsony</option>
        <option value="normal">Normál</option>
        <option value="high">Magas</option>
        <option value="urgent">Sürgős</option>
      </select>
      <input name="insurer" placeholder="Biztosító" />
      <input name="claim_number" placeholder="Kárszám" />
      <input name="vehicle_plate" placeholder="Rendszám" />
      <input name="vin" placeholder="Alvázszám" />
      <input type="date" name="event_date" />
      <textarea name="summary" placeholder="Összefoglaló" className="md:col-span-2" rows={4} />
      <Button type="submit" disabled={loading} className="w-fit">{loading ? "Mentés..." : "Ügy létrehozása"}</Button>
    </form>
  );
}
