import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-[var(--radius-card)] border border-slate-200 bg-white p-4 shadow-[var(--shadow-soft)]", className)} {...props} />;
}
