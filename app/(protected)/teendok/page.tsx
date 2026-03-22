import { TaskToggle } from "@/components/crm/task-toggle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listTasks } from "@/lib/db/queries";
import { formatDate } from "@/lib/utils/date";
import Link from "next/link";

export default async function TasksPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const tasks = await listTasks(params.priority, params.status, params.q);
  const today = new Date().toISOString().slice(0, 10);

  const grouped = {
    overdue: tasks.filter((t) => t.status === "open" && t.due_date < today),
    today: tasks.filter((t) => t.status === "open" && t.due_date === today),
    upcoming: tasks.filter((t) => t.status === "open" && t.due_date > today),
    done: tasks.filter((t) => t.status === "done")
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <form className="flex flex-wrap gap-2">
          <input name="q" placeholder="Keresés teendőben" defaultValue={params.q} />
          <select name="priority" defaultValue={params.priority ?? ""}><option value="">Minden prioritás</option><option value="low">Alacsony</option><option value="normal">Normál</option><option value="high">Magas</option><option value="urgent">Sürgős</option></select>
          <select name="status" defaultValue={params.status ?? ""}><option value="">Minden státusz</option><option value="open">Nyitott</option><option value="done">Kész</option></select>
          <button className="rounded-lg border px-3">Szűrés</button>
        </form>
        <Link href="/teendok/uj" className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white">+ Új teendő</Link>
      </div>

      {Object.entries(grouped).map(([key, items]) => (
        <Card key={key}>
          <h2 className="mb-2 font-semibold">{{ overdue: "Lejárt", today: "Mai", upcoming: "Következő", done: "Elkészült" }[key]}</h2>
          <ul className="space-y-2 text-sm">
            {items.map((task) => (
              <li key={task.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-2">
                <div className="flex items-center gap-2"><TaskToggle id={task.id} done={task.status === "done"} /><span>{task.title} · {formatDate(task.due_date)}</span><Badge value={task.priority} /></div>
                <div className="flex gap-2 text-xs">
                  {task.case_id ? <Link className="text-brand-600" href={`/ugyek/${task.case_id}`}>Ügy</Link> : null}
                  {task.contact_id ? <Link className="text-brand-600" href={`/kapcsolatok/${task.contact_id}`}>Kapcsolat</Link> : null}
                </div>
              </li>
            ))}
            {!items.length ? <li className="text-slate-500">Nincs elem.</li> : null}
          </ul>
        </Card>
      ))}
    </div>
  );
}
