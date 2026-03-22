import { DocumentUpload } from "@/components/forms/document-upload";
import { NoteForm } from "@/components/forms/note-form";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/date";
import Link from "next/link";

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: contact }, { data: cases }, { data: tasks }, { data: notes }, { data: documents }] = await Promise.all([
    supabase.from("contacts").select("*").eq("id", id).single(),
    supabase.from("cases").select("*").eq("contact_id", id).order("updated_at", { ascending: false }),
    supabase.from("tasks").select("*").eq("contact_id", id).order("due_date", { ascending: true }),
    supabase.from("notes").select("*").eq("contact_id", id).order("created_at", { ascending: false }),
    supabase.from("documents").select("*").eq("contact_id", id).order("created_at", { ascending: false })
  ]);

  if (!contact) return <p>Nincs ilyen kapcsolat.</p>;

  return (
    <div className="space-y-4">
      <Card>
        <h1 className="text-2xl font-bold">{contact.full_name}</h1>
        <p className="text-sm text-slate-600">{contact.phone} · {contact.email}</p>
        <p className="text-sm text-slate-600">{contact.address}</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Ügyek</h2><Link href={`/ugyek/uj?contactId=${id}`} className="text-sm text-brand-600">+ Új ügy</Link></div>
          <ul className="space-y-2 text-sm">{cases?.map((item) => <li key={item.id}><Link href={`/ugyek/${item.id}`}>{item.case_number} – {item.title}</Link></li>) ?? null}</ul>
        </Card>
        <Card>
          <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Teendők</h2><Link href={`/teendok/uj?contactId=${id}`} className="text-sm text-brand-600">+ Új teendő</Link></div>
          <ul className="space-y-2 text-sm">{tasks?.map((item) => <li key={item.id}>{item.title} ({formatDate(item.due_date)})</li>) ?? null}</ul>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold">Megjegyzések / előzmények</h2>
        <NoteForm contactId={id} />
        <ul className="mt-3 space-y-2 text-sm">{notes?.map((item) => <li key={item.id} className="rounded-lg bg-slate-50 p-2">{item.content}</li>)}</ul>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">Dokumentumok</h2>
        <DocumentUpload contactId={id} />
        <ul className="mt-3 space-y-2 text-sm">{documents?.map((doc) => <li key={doc.id}>{doc.file_name}</li>)}</ul>
      </Card>
    </div>
  );
}
