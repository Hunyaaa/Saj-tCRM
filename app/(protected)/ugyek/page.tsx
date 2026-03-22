import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { listCases } from "@/lib/db/queries";
import { caseTypeLabels, statusLabels } from "@/lib/utils/labels";
import Link from "next/link";

export default async function CasesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const cases = await listCases(params.q, params.status, params.case_type, params.priority);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <form className="flex flex-wrap gap-2">
          <input name="q" placeholder="Ügyszám, cím, ügyfél, biztosító" defaultValue={params.q} />
          <select name="status" defaultValue={params.status ?? ""}><option value="">Minden státusz</option>{Object.entries(statusLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select>
          <select name="case_type" defaultValue={params.case_type ?? ""}><option value="">Minden típus</option>{Object.entries(caseTypeLabels).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select>
          <select name="priority" defaultValue={params.priority ?? ""}><option value="">Minden prioritás</option><option value="low">Alacsony</option><option value="normal">Normál</option><option value="high">Magas</option><option value="urgent">Sürgős</option></select>
          <button className="rounded-lg border px-3">Szűrés</button>
        </form>
        <Link href="/ugyek/uj" className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white">+ Új ügy</Link>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left"><tr><th className="p-3">Ügyszám</th><th>Cím</th><th>Ügyfél</th><th>Státusz</th><th>Prioritás</th><th></th></tr></thead>
          <tbody>
            {cases.map((c) => <tr key={c.id} className="border-t"><td className="p-3">{c.case_number}</td><td>{c.title}</td><td>{(c.contacts as { full_name: string } | null)?.full_name ?? "-"}</td><td><Badge value={c.status} /></td><td><Badge value={c.priority} /></td><td><Link className="text-brand-600" href={`/ugyek/${c.id}`}>Megnyitás</Link></td></tr>)}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
