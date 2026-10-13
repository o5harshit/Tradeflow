
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: "▦" },
  { label: "Markets", href: "/dashboard/markets", icon: "↗" },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: "◫" },
  { label: "Orders", href: "/dashboard/orders", icon: "⇄" },
];

export default function Sidebar({ onNavigate }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-white/[0.08] bg-[#0a101c]">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex h-[76px] items-center gap-3 border-b border-white/[0.08] px-6"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400 font-bold text-slate-950">
          T
        </span>
        <span className="text-lg font-semibold tracking-tight">
          Trade<span className="text-emerald-400">Flow</span>
        </span>
      </Link>

      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-all duration-200 ${
                  active
                    ? "border border-emerald-400/15 bg-emerald-400/10 font-medium text-emerald-300"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-lg">
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="text-xs font-medium text-emerald-300">
              Paper trading mode
            </p>
          </div>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Practice with virtual funds. No real orders are placed.
          </p>
        </div>
      </div>
    </aside>
  );
}
