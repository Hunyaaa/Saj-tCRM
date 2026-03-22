"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import { caseTypeLabels, statusLabels } from "@/lib/utils/labels";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type CaseRow = Database["public"]["Tables"]["cases"]["Row"];

export function CaseForm({
  caseItem,
  contacts
}: {
  caseItem?: CaseRow | null;
  contacts: Array<{ id: string; full_name: string }>;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setMessage(null);

    const contactId = String(formData.get("contact_id") || "").trim();
    const caseNumber = String(formData.get("case_number") || "").trim();
    const title = String(formData.get("title") || "").trim();

    if (!contactId || !caseNumber || !title) {
      setError("Kapcsolat, ügyszám és cím kötelező mező.");
      setLoading(false);
      return;
    }

    const payload = {
      contact_id: contactId,
      case_number: caseNumber,
      title,
      case_type: String(formData.get("case_type") || "other") as CaseRow["case_type"],
      insurer: String(formData.get("insurer") || "").trim() || null,
      claim_number: String(formData.get("claim_number") || "").trim() || null,
      vehicle_plate: String(formData.get("vehicle_plate") || "").trim() || null,
      vin: String(formData.get("vin") || "").trim() || null,
      event_date: String(formData.get("event_date") || "").trim() || null,
      status: String(formData.get("status") || "new") as CaseRow["status"],
      priority: String(formData.get("priority") || "normal") as CaseRow["priority"],
      summary: String(formData.get("summary") || "").trim() || null
    };

    const supabase = createClient();
    if (caseItem?.id) {
      const { error } = await supabase.from("cases").update(payload).eq("id", caseItem.id);
      if (error) {
        setError(`Mentési hiba: ${error.message}`);
        setLoading(false);
        return;
      }
      setMessage("Ügy sikeresen mentve.");
      router.push(`/ugyek/${caseItem.id}`);
      router.refresh();
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from("cases").insert(payload).select("id").single();
    if (error || !data) {
      setError(`Létrehozási hiba: ${error?.message ?? "ismeretlen hiba"}`);
      setLoading(false);
      return;
    }

    setMessage("Ügy sikeresen létrehozva.");
    router.push(`/ugyek/${data.id}`);
    router.refresh();
    setLoading(false);
  }

  return (
    <form action={onSubmit} className="grid gap-3 md:grid-cols-2">
      <select name="contact_id" required defaultValue={caseItem?.contact_id ?? params.get("contactId") ?? ""}>
        <option value="">Kapcsolat kiválasztása</option>
        {contacts.map((contact) => (
          <option key={contact.id} value={contact.id}>
            {contact.full_name}
          </option>
        ))}
      </select>
      <input name="case_number" required placeholder="Ügyszám" defaultValue={caseItem?.case_number ?? ""} />
      <input name="title" required placeholder="Ügy címe" className="md:col-span-2" defaultValue={caseItem?.title ?? ""} />
      <select name="case_type" defaultValue={caseItem?.case_type ?? "vehicle_damage"}>
        {Object.entries(caseTypeLabels).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <select name="status" defaultValue={caseItem?.status ?? "new"}>
        {Object.entries(statusLabels).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
      <select name="priority" defaultValue={caseItem?.priority ?? "normal"}>
        <option value="low">Alacsony</option>
        <option value="normal">Normál</option>
        <option value="high">Magas</option>
        <option value="urgent">Sürgős</option>
      </select>
      <input name="insurer" placeholder="Biztosító" defaultValue={caseItem?.insurer ?? ""} />
      <input name="claim_number" placeholder="Kárszám" defaultValue={caseItem?.claim_number ?? ""} />
      <input name="vehicle_plate" placeholder="Rendszám" defaultValue={caseItem?.vehicle_plate ?? ""} />
      <input name="vin" placeholder="Alvázszám" defaultValue={caseItem?.vin ?? ""} />
      <input type="date" name="event_date" defaultValue={caseItem?.event_date ?? ""} />
      <textarea name="summary" placeholder="Összefoglaló" className="md:col-span-2" rows={4} defaultValue={caseItem?.summary ?? ""} />
      {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}
      {message ? <p className="md:col-span-2 text-sm text-emerald-700">{message}</p> : null}
      <Button type="submit" disabled={loading} className="w-fit">{loading ? "Mentés..." : caseItem ? "Ügy mentése" : "Ügy létrehozása"}</Button>
    </form>
  );
}
