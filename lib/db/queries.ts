import { createClient } from "@/lib/supabase/server";

export async function getDashboardData() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [todayOpen, overdueOpen, recentCases, recentContacts, openCasesCount, closedCasesCount, openTasksCount, overdueTasksCount] = await Promise.all([
    supabase.from("tasks").select("*").eq("status", "open").eq("due_date", today).order("due_time", { ascending: true }),
    supabase.from("tasks").select("*").eq("status", "open").lt("due_date", today).order("due_date", { ascending: true }),
    supabase.from("cases").select("id, case_number, title").order("created_at", { ascending: false }).limit(6),
    supabase.from("contacts").select("id, full_name").order("created_at", { ascending: false }).limit(6),
    supabase.from("cases").select("id", { count: "exact", head: true }).neq("status", "closed"),
    supabase.from("cases").select("id", { count: "exact", head: true }).eq("status", "closed"),
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("status", "open").lt("due_date", today)
  ]);

  return {
    openTasks: todayOpen.data ?? [],
    overdueTasks: overdueOpen.data ?? [],
    recentCases: recentCases.data ?? [],
    recentContacts: recentContacts.data ?? [],
    summary: {
      openCases: openCasesCount.count ?? 0,
      openTasks: openTasksCount.count ?? 0,
      overdueTasks: overdueTasksCount.count ?? 0,
      closedCases: closedCasesCount.count ?? 0
    }
  };
}

export async function listContacts(query?: string, source?: string) {
  const supabase = await createClient();
  let req = supabase.from("contacts").select("*").order("updated_at", { ascending: false });
  if (source) req = req.eq("source", source);
  if (query) req = req.or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`);
  const { data } = await req;
  return data ?? [];
}

export async function getContactById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("contacts").select("*").eq("id", id).single();
  return data;
}

export async function listContactOptions() {
  const supabase = await createClient();
  const { data } = await supabase.from("contacts").select("id, full_name").order("full_name", { ascending: true });
  return data ?? [];
}

export async function listCases(query?: string, status?: string, caseType?: string, priority?: string) {
  const supabase = await createClient();
  let req = supabase.from("cases").select("*, contacts(full_name)").order("updated_at", { ascending: false });
  if (status) req = req.eq("status", status);
  if (caseType) req = req.eq("case_type", caseType);
  if (priority) req = req.eq("priority", priority);
  if (query) req = req.or(`case_number.ilike.%${query}%,title.ilike.%${query}%,insurer.ilike.%${query}%`);
  const { data } = await req;
  return data ?? [];
}

export async function getCaseById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("cases").select("*").eq("id", id).single();
  return data;
}

export async function listCaseOptions() {
  const supabase = await createClient();
  const { data } = await supabase.from("cases").select("id, case_number, title").order("case_number", { ascending: false });
  return data ?? [];
}

export async function listTasks(priority?: string, status?: string, query?: string) {
  const supabase = await createClient();
  let req = supabase.from("tasks").select("*, cases(title), contacts(full_name)").order("due_date", { ascending: true });
  if (priority) req = req.eq("priority", priority);
  if (status) req = req.eq("status", status);
  if (query) req = req.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  const { data } = await req;
  return data ?? [];
}
