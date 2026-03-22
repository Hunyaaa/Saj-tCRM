"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { sourceLabels } from "@/lib/utils/labels";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ContactForm({ contactId }: { contactId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const supabase = createClient();
    const payload = {
      full_name: String(formData.get("full_name") || ""),
      phone: String(formData.get("phone") || "") || null,
      email: String(formData.get("email") || "") || null,
      address: String(formData.get("address") || "") || null,
      source: String(formData.get("source") || "other"),
      tags: String(formData.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    if (contactId) {
      await supabase.from("contacts").update(payload).eq("id", contactId);
      router.push(`/kapcsolatok/${contactId}`);
    } else {
      const { data } = await supabase.from("contacts").insert(payload).select("id").single();
      router.push(`/kapcsolatok/${data?.id ?? ""}`);
    }
    router.refresh();
    setLoading(false);
  }

  return (
    <form action={onSubmit} className="space-y-3">
      <input name="full_name" required placeholder="Teljes név" />
      <input name="phone" placeholder="Telefonszám" />
      <input name="email" type="email" placeholder="Email" />
      <input name="address" placeholder="Cím" />
      <select name="source" defaultValue="direct">
        {Object.entries(sourceLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <input name="tags" placeholder="Tag-ek vesszővel elválasztva" />
      <Button type="submit" disabled={loading}>{loading ? "Mentés..." : "Mentés"}</Button>
    </form>
  );
}
