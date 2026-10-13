
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import StatCard from "@/components/dashboard/StatCard";

const stats = [
  {
    label: "Virtual balance",
    value: "₹10,00,000",
    change: "Starting demo funds",
    icon: "₹",
    positive: true,
  },
  {
    label: "Portfolio value",
    value: "₹10,00,000",
    change: "No positions yet",
    icon: "◫",
    positive: true,
  },
  {
    label: "Total P&L",
    value: "₹0.00",
    change: "0.00% return",
    icon: "↗",
    positive: true,
  },
  {
    label: "Open positions",
    value: "0",
    change: "Ready to get started",
    icon: "▤",
    positive: true,
  },
];

const actions = [
  {
    title: "Explore markets",
    description: "Browse instruments and their demo prices.",
    href: "/dashboard/markets",
    icon: "↗",
  },
  {
    title: "View portfolio",
    description: "Review your holdings and performance.",
    href: "/dashboard/portfolio",
    icon: "◫",
  },
  {
    title: "Order history",
    description: "Track your simulated trading activity.",
    href: "/dashboard/orders",
    icon: "⇄",
  },
];

export default function DashboardPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-9">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.5 }}
        className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
      >
        <div>
          <p className="text-sm font-medium text-emerald-400">
            YOUR WORKSPACE
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trading overview
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Practice your strategy, monitor your virtual portfolio,
            and learn from every simulated trade.
          </p>
        </div>

        <Link
          href="/dashboard/markets"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-300"
        >
          Explore markets <span>↗</span>
        </Link>
      </motion.section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Portfolio summary</h2>
          <span className="text-xs text-slate-500">
            Illustrative values
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : index * 0.08,
              }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-lg font-semibold">Quick access</h2>
          <p className="mt-1 text-sm text-slate-400">
            Continue to the part of TradeFlow you need.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {actions.map((action, index) => (
            <motion.div
              key={action.href}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.4,
                delay: reduceMotion ? 0 : 0.15 + index * 0.08,
              }}
            >
              <Link
                href={action.href}
                className="group block h-full rounded-2xl border border-white/[0.08] bg-[#0c1321] p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25 hover:bg-[#101a2b]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.08] text-xl text-emerald-400">
                  {action.icon}
                </span>

                <h3 className="mt-5 font-semibold transition-colors group-hover:text-emerald-300">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {action.description}
                </p>

                <p className="mt-5 text-sm font-medium text-emerald-400">
                  Open section <span>→</span>
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-[#0c1321] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <p className="mt-2 text-sm text-slate-400">
              Your simulated orders will appear here.
            </p>
          </div>

          <Link
            href="/dashboard/orders"
            className="text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
          >
            View history →
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-white/10 px-5 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-2xl text-slate-400">
            ⇄
          </div>
          <p className="mt-4 font-medium">No orders yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Your order history will appear after you place a simulated trade.
          </p>
          <Link
            href="/dashboard/markets"
            className="mt-5 inline-flex text-sm font-medium text-emerald-400 hover:text-emerald-300"
          >
            Explore markets →
          </Link>
        </div>
      </section>

      <p className="text-xs leading-5 text-slate-500">
        The portfolio figures above are placeholders for the UI. They are
        not fetched from MongoDB and do not represent actual account balances.
      </p>
    </div>
  );
}
