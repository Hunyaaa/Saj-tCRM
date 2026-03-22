import { CaseForm } from "@/components/forms/case-form";
import { Card } from "@/components/ui/card";

export default function NewCasePage() {
  return <Card><h1 className="mb-4 text-xl font-semibold">Új ügy</h1><CaseForm /></Card>;
}
