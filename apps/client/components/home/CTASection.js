
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function CTASection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="about"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-[1440px] px-5 py-20 sm:px-10 lg:px-16 lg:py-24"
    >
      <div className="flex flex-col justify-between gap-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-emerald-400/[0.09] to-transparent p-7 sm:p-10 lg:flex-row lg:items-center lg:p-14">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Your next chapter
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Better decisions start with practice.
          </h2>

          <p className="mt-4 leading-7 text-slate-400">
            Explore market behavior, test your ideas, and develop
            your trading discipline in a simulated environment.
          </p>
        </div>

        <motion.div
          whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-400 px-6 py-4 text-sm font-semibold text-slate-950 transition-colors duration-300 hover:bg-emerald-300"
          >
            Create your account <span>↗</span>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
