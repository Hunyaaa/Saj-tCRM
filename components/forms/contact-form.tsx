"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { sourceLabels } from "@/lib/utils/labels";
import type { Database } from "@/lib/supabase/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type ContactRow = Database["public"]["Tables"]["contacts"]["Row"];

export function ContactForm({ contact }: { contact?: ContactRow | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tagsDefault = useMemo(() => contact?.tags?.join(", ") ?? "", [contact?.tags]);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setMessage(null);

    const fullName = String(formData.get("full_name") || "").trim();
    if (!fullName) {
      setError("A teljes név megadása kötelező.");
      setLoading(false);
      return;
    }

    const payload = {
      full_name: fullName,
      phone: String(formData.get("phone") || "").trim() || null,
      email: String(formData.get("email") || "").trim() || null,
      address: String(formData.get("address") || "").trim() || null,
      source: String(formData.get("source") || "other") as ContactRow["source"],
      tags: String(formData.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    const supabase = createClient();
    if (contact?.id) {
      const { error } = await supabase.from("contacts").update(payload).eq("id", contact.id);
      if (error) {
        setError(`Mentési hiba: ${error.message}`);
        setLoading(false);
        return;
      }
      setMessage("Kapcsolat sikeresen mentve.");
      router.refresh();
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from("contacts").insert(payload).select("id").single();
    if (error || !data) {
      setError(`Létrehozási hiba: ${error?.message ?? "ismeretlen hiba"}`);
      setLoading(false);
      return;
    }

    setMessage("Kapcsolat sikeresen létrehozva.");
    router.push(`/kapcsolatok/${data.id}`);
    router.refresh();
    setLoading(false);
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <input name="full_name" required placeholder="Teljes név" defaultValue={contact?.full_name ?? ""} />
      <input name="phone" placeholder="Telefonszám" defaultValue={contact?.phone ?? ""} />
      <input name="email" type="email" placeholder="Email" defaultValue={contact?.email ?? ""} />
      <input name="address" placeholder="Cím" defaultValue={contact?.address ?? ""} />
      <select name="source" defaultValue={contact?.source ?? "direct"}>
        {Object.entries(sourceLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <input name="tags" placeholder="Tag-ek vesszővel elválasztva" defaultValue={tagsDefault} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
      <Button type="submit" disabled={loading}>{loading ? "Mentés..." : "Mentés"}</Button>
    </form>
  );
}
