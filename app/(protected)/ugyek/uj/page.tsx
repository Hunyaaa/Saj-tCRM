import { CaseForm } from "@/components/forms/case-form";
import { Card } from "@/components/ui/card";
import { listContactOptions } from "@/lib/db/queries";

export default async function NewCasePage() {
  const contacts = await listContactOptions();
  return <Card><h1 className="mb-4 text-xl font-semibold">Új ügy</h1><CaseForm contacts={contacts} /></Card>;
}
