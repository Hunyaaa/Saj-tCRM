import { TaskForm } from "@/components/forms/task-form";
import { Card } from "@/components/ui/card";
import { listCaseOptions, listContactOptions } from "@/lib/db/queries";

export default async function NewTaskPage() {
  const [contacts, cases] = await Promise.all([listContactOptions(), listCaseOptions()]);
  return <Card><h1 className="mb-4 text-xl font-semibold">Új teendő</h1><TaskForm contacts={contacts} cases={cases} /></Card>;
}
