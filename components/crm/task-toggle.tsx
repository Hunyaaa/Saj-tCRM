"use client";

import { useRouter } from "next/navigation";

export function TaskToggle({ id, done }: { id: string; done: boolean }) {
  const router = useRouter();

  async function onChange(nextDone: boolean) {
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextDone ? "done" : "open" })
    });
    router.refresh();
  }

  return <input type="checkbox" checked={done} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />;
}
