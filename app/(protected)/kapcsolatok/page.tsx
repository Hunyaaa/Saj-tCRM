import { Card } from "@/components/ui/card";
import { listContacts } from "@/lib/db/queries";
import { sourceLabels } from "@/lib/utils/labels";
import Link from "next/link";

export default async function ContactsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const contacts = await listContacts(params.q, params.source);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <form className="flex flex-wrap gap-2">
          <input name="q" placeholder="Keresés név, telefon, email" defaultValue={params.q} />
          <select name="source" defaultValue={params.source ?? ""}>
            <option value="">Minden forrás</option>
            {Object.entries(sourceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="rounded-lg border px-3">Szűrés</button>
        </form>
        <Link href="/kapcsolatok/uj" className="rounded-lg bg-brand-600 px-3 py-2 text-sm text-white">+ Új kapcsolat</Link>
      </div>
      <Card className="overflow-x-auto p-0">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left"><tr><th className="p-3">Név</th><th>Telefon</th><th>Email</th><th>Forrás</th><th></th></tr></thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-t"><td className="p-3 font-medium">{c.full_name}</td><td>{c.phone}</td><td>{c.email}</td><td>{sourceLabels[c.source]}</td><td><Link className="text-brand-600" href={`/kapcsolatok/${c.id}`}>Megnyitás</Link></td></tr>
            ))}
          </tbody>
        </table>
        {!contacts.length && <div className="p-4 text-sm text-slate-500">Nincs találat.</div>}
      </Card>
    </div>
  );
}
