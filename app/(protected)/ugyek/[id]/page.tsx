import { DocumentUpload } from "@/components/forms/document-upload";
import { NoteForm } from "@/components/forms/note-form";
import { TaskToggle } from "@/components/crm/task-toggle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils/date";
import Link from "next/link";

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: item }, { data: tasks }, { data: notes }, { data: documents }] = await Promise.all([
    supabase.from("cases").select("*, contacts(*)").eq("id", id).single(),
    supabase.from("tasks").select("*").eq("case_id", id).order("due_date", { ascending: true }),
    supabase.from("notes").select("*").eq("case_id", id).order("created_at", { ascending: false }),
    supabase.from("documents").select("*").eq("case_id", id).order("created_at", { ascending: false })
  ]);

  if (!item) return <p>Nincs ilyen ügy.</p>;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm text-slate-500">{item.case_number}</p>
            <h1 className="text-2xl font-bold">{item.title}</h1>
          </div>
          <div className="flex gap-2"><Badge value={item.status} /><Badge value={item.priority} /></div>
        </div>
        <div className="mt-3 text-sm text-slate-600">
          <p>Kapcsolat: <Link href={`/kapcsolatok/${item.contact_id}`} className="text-brand-600">{(item.contacts as { full_name: string }).full_name}</Link></p>
          <p>Biztosító: {item.insurer ?? "-"} · Kárszám: {item.claim_number ?? "-"}</p>
          <p>Esemény dátuma: {item.event_date ? formatDate(item.event_date) : "-"}</p>
          <p className="mt-2">{item.summary ?? "Nincs összefoglaló."}</p>
        </div>
      </Card>

      <Card>
        <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Teendők</h2><Link href={`/teendok/uj?caseId=${id}&contactId=${item.contact_id}`} className="text-sm text-brand-600">+ Új teendő</Link></div>
        <ul className="space-y-2 text-sm">
          {tasks?.map((task) => (
            <li key={task.id} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
              <TaskToggle id={task.id} done={task.status === "done"} />
              <span className={task.status === "done" ? "line-through text-slate-500" : ""}>{task.title} ({formatDate(task.due_date)})</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">Idővonal / megjegyzések</h2>
        <NoteForm caseId={id} contactId={item.contact_id} />
        <ul className="mt-3 space-y-2 text-sm">{notes?.map((n) => <li key={n.id} className="rounded-lg bg-slate-50 p-2">{n.content}</li>)}</ul>
      </Card>

      <Card>
        <h2 className="mb-3 font-semibold">Dokumentumok</h2>
        <DocumentUpload caseId={id} contactId={item.contact_id} />
        <ul className="mt-3 space-y-2 text-sm">{documents?.map((doc) => <li key={doc.id}>{doc.file_name}</li>)}</ul>
      </Card>
    </div>
  );
}
