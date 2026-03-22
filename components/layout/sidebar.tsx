import Link from "next/link";
import { Home, Contact, BriefcaseBusiness, CheckSquare, Calendar } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Vezérlőpult", icon: Home },
  { href: "/kapcsolatok", label: "Kapcsolatok", icon: Contact },
  { href: "/ugyek", label: "Ügyek", icon: BriefcaseBusiness },
  { href: "/teendok", label: "Teendők", icon: CheckSquare },
  { href: "/naptar", label: "Agenda", icon: Calendar }
];

export function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="p-4 text-lg font-bold">miniCRM</div>
      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 md:block md:space-y-1 md:overflow-visible">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 md:flex">
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
