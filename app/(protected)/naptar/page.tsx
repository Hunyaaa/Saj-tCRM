import { Card } from "@/components/ui/card";
import { listTasks } from "@/lib/db/queries";
import { agendaGroupLabel, formatDate } from "@/lib/utils/date";

export default async function AgendaPage() {
  const tasks = await listTasks(undefined, "open", undefined);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);

  const filtered = tasks.filter((task) => {
    const d = new Date(task.due_date);
    return d >= new Date(today.toISOString().slice(0, 10)) && d <= weekEnd;
  });

  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">Agenda (ma / holnap / hét)</h1>
      <ul className="space-y-2 text-sm">
        {filtered.map((task) => (
          <li key={task.id} className="rounded-lg bg-slate-50 p-3">
            <p className="font-medium">{task.title}</p>
            <p className="text-slate-600">{agendaGroupLabel(task.due_date)} · {formatDate(task.due_date)}</p>
          </li>
        ))}
        {!filtered.length ? <li className="text-slate-500">Nincs közelgő nyitott teendő.</li> : null}
      </ul>
    </Card>
  );
}
