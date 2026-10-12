
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.07]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 py-8 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-16">
        <div>
          <Link href="/" className="flex w-fit items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400 font-black text-slate-950">
              T
            </span>
            <span className="text-lg font-bold">TradeFlow</span>
          </Link>

          <p className="mt-3 max-w-sm text-xs leading-5 text-slate-500">
            A paper-trading and market-simulation project for learning,
            experimentation, and portfolio development.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how-it-works" className="hover:text-white">How it works</a>
          <Link href="/login" className="hover:text-white">Sign in</Link>
          <Link href="/register" className="hover:text-white">Register</Link>
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-5 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} TradeFlow. Paper trading only; no real trades are executed.
      </div>
    </footer>
  );
}
