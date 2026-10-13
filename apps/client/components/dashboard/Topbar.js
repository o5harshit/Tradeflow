
"use client";

export default function Topbar({ user, onMenuClick }) {
  const email = user?.email || "Trader";
  const initials = email === "Trader" ? "T" : email[0].toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.08] bg-[#080d17]/90 px-4 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg border border-white/10 px-3 py-2 text-slate-300 transition hover:bg-white/5 lg:hidden"
        >
          ☰
        </button>

        <div>
          <p className="text-sm font-semibold">Trading workspace</p>
          <p className="mt-1 hidden text-xs text-slate-500 sm:block">
            Your practice account at a glance
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-300 sm:inline-flex">
          ● Simulation
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-sm font-semibold text-emerald-300">
          {initials}
        </div>

        <div className="hidden max-w-40 sm:block">
          <p className="truncate text-sm font-medium">{email}</p>
          <p className="mt-0.5 text-xs text-slate-500">Paper trader</p>
        </div>
      </div>
    </header>
  );
}
