import { Card } from "@/components/ui/card";
import { getDashboardData } from "@/lib/db/queries";
import Link from "next/link";

export default async function DashboardPage() {
  const { summary, openTasks, overdueTasks, recentCases, recentContacts } = await getDashboardData();

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Nyitott ügyek</p><p className="text-3xl font-bold">{summary.openCases}</p></Card>
        <Card><p className="text-sm text-slate-500">Nyitott teendők</p><p className="text-3xl font-bold">{summary.openTasks}</p></Card>
        <Card><p className="text-sm text-slate-500">Lejárt teendők</p><p className="text-3xl font-bold text-red-600">{summary.overdueTasks}</p></Card>
        <Card><p className="text-sm text-slate-500">Lezárt ügyek</p><p className="text-3xl font-bold">{summary.closedCases}</p></Card>
      </section>

      <section className="flex flex-wrap gap-2">
        <Link href="/kapcsolatok/uj" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">+ Új kapcsolat</Link>
        <Link href="/ugyek/uj" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">+ Új ügy</Link>
        <Link href="/teendok/uj" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">+ Új teendő</Link>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Mai nyitott teendők</h2>
          <ul className="space-y-2 text-sm">{openTasks.length ? openTasks.map((task) => <li key={task.id}>{task.title}</li>) : <li className="text-slate-500">Nincs mai teendő.</li>}</ul>
        </Card>
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Lejárt teendők</h2>
          <ul className="space-y-2 text-sm">{overdueTasks.length ? overdueTasks.map((task) => <li key={task.id}>{task.title}</li>) : <li className="text-slate-500">Nincs lejárt teendő.</li>}</ul>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Friss ügyek</h2>
          <ul className="space-y-2 text-sm">
            {recentCases.length ? recentCases.map((item) => <li key={item.id}><Link href={`/ugyek/${item.id}`} className="hover:underline">{item.case_number} – {item.title}</Link></li>) : <li className="text-slate-500">Nincs ügy.</li>}
          </ul>
        </Card>
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Friss kapcsolatok</h2>
          <ul className="space-y-2 text-sm">
            {recentContacts.length ? recentContacts.map((item) => <li key={item.id}><Link href={`/kapcsolatok/${item.id}`} className="hover:underline">{item.full_name}</Link></li>) : <li className="text-slate-500">Nincs kapcsolat.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
