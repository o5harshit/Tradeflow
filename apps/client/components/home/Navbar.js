
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#070b14]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-xl font-black text-slate-950">
            T
          </span>
          <span className="text-xl font-bold tracking-tight text-white">
            TradeFlow
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-white">
            How it works
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Get started ↗
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded-lg border border-white/10 px-3 py-2 text-white sm:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-white/[0.07] bg-[#0c1321] p-5 sm:hidden">
          <div className="mx-auto flex max-w-xl flex-col gap-4 text-sm">
            <a onClick={() => setMenuOpen(false)} href="#features" className="text-slate-300">
              Features
            </a>
            <a onClick={() => setMenuOpen(false)} href="#how-it-works" className="text-slate-300">
              How it works
            </a>
            <a onClick={() => setMenuOpen(false)} href="#about" className="text-slate-300">
              About
            </a>
            <Link href="/login" className="text-slate-300">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-emerald-400 px-4 py-3 text-center font-semibold text-slate-950"
            >
              Create account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
