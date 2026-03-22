import { CaseForm } from "@/components/forms/case-form";
import { Card } from "@/components/ui/card";
import { getCaseById, listContactOptions } from "@/lib/db/queries";

export default async function EditCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [caseItem, contacts] = await Promise.all([getCaseById(id), listContactOptions()]);

  if (!caseItem) return <p>Nincs ilyen ügy.</p>;

  return (
    <Card>
      <h1 className="mb-4 text-xl font-semibold">Ügy szerkesztése</h1>
      <CaseForm caseItem={caseItem} contacts={contacts} />
    </Card>
  );
}
