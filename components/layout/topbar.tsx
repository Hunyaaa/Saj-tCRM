"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Topbar() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/bejelentkezes");
    router.refresh();
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <h1 className="text-lg font-semibold">Belső ügykezelő</h1>
      <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100" onClick={handleLogout}>
        Kijelentkezés
      </button>
    </header>
  );
}
