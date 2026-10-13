
"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function StatCard({
  label,
  value,
  change,
  icon,
  positive,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="rounded-2xl border border-white/[0.08] bg-[#0c1321] p-5 transition-colors duration-300 hover:border-emerald-400/20 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/[0.08] text-lg text-emerald-400">
          {icon}
        </span>
      </div>

      <p className="mt-5 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
        {value}
      </p>

      {change && (
        <p
          className={`mt-3 text-xs ${
            positive ? "text-emerald-400" : "text-slate-400"
          }`}
        >
          {change}
        </p>
      )}
    </motion.article>
  );
}
