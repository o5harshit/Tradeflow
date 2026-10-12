
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import MarketPreview from "./MarketPreview";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 h-96 w-96 rounded-full bg-emerald-500/[0.08] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-20 -z-10 h-96 w-96 rounded-full bg-blue-500/[0.08] blur-[120px]" />

      <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 py-20 sm:px-10 sm:py-28 lg:grid-cols-[1fr_0.95fr] lg:gap-16 lg:px-16">
        {/* Hero content */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            YOUR MARKETS. YOUR STRATEGY.
          </div>

          <h1 className="mt-8 text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl xl:text-7xl">
            Learn to trade.
            <br />
            <span className="text-emerald-400">
              Without the risk.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            Practice strategies, explore market movements, and learn
            to manage a virtual portfolio without risking real money.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-4 text-sm font-semibold text-slate-950 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/10"
            >
              Start paper trading <span aria-hidden="true">↗</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-4 text-sm font-semibold text-white transition-all duration-300 hover:border-slate-500 hover:bg-white/[0.04]"
            >
              Sign in to your account
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            <span>
              <span className="text-emerald-400">✓</span> Virtual funds
            </span>
            <span>
              <span className="text-emerald-400">✓</span> Practice at your pace
            </span>
            <span>
              <span className="text-emerald-400">✓</span> No real orders
            </span>
          </div>
        </motion.div>

        {/* Animated market preview */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <MarketPreview />
        </motion.div>
      </div>
    </section>
  );
}
