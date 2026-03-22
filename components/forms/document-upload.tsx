"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DocumentUpload({ contactId, caseId }: { contactId?: string; caseId?: string }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("other");

  async function onSubmit() {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    if (contactId) formData.append("contactId", contactId);
    if (caseId) formData.append("caseId", caseId);
    formData.append("category", category);
    await fetch("/api/documents/upload", { method: "POST", body: formData });
    router.refresh();
  }

  return (
    <div className="space-y-2">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <div className="flex items-center gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="invoice">Számla</option>
          <option value="insurer_letter">Biztosítói levél</option>
          <option value="photo">Fotó</option>
          <option value="estimate">Kalkuláció</option>
          <option value="contract">Szerződés</option>
          <option value="other">Egyéb</option>
        </select>
        <Button type="button" onClick={onSubmit}>Dokumentum feltöltése</Button>
      </div>
    </div>
  );
}
