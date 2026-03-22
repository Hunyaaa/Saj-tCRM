import { TaskForm } from "@/components/forms/task-form";
import { Card } from "@/components/ui/card";

export default function NewTaskPage() {
  return <Card><h1 className="mb-4 text-xl font-semibold">Új teendő</h1><TaskForm /></Card>;
}
