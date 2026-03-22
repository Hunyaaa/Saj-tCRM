import { cn } from "@/lib/utils/cn";

const variants: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  waiting: "bg-violet-100 text-violet-800",
  closed: "bg-emerald-100 text-emerald-800",
  open: "bg-slate-100 text-slate-800",
  done: "bg-emerald-100 text-emerald-800",
  low: "bg-slate-100 text-slate-700",
  normal: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800"
};

export function Badge({ value }: { value: string }) {
  return <span className={cn("rounded-full px-2 py-1 text-xs font-semibold", variants[value] ?? "bg-slate-100 text-slate-700")}>{value}</span>;
}
