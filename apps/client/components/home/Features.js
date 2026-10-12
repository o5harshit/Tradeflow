
"use client";

import { motion, useReducedMotion } from "framer-motion";

const features = [
  {
    number: "01",
    icon: "↗",
    title: "Practice trading",
    description:
      "Place simulated orders, explore market movements, and experiment with trading strategies without risking real money.",
  },
  {
    number: "02",
    icon: "◫",
    title: "Track your portfolio",
    description:
      "Bring virtual cash, holdings, and order history together in one organized trading workspace.",
  },
  {
    number: "03",
    icon: "⌁",
    title: "Review performance",
    description:
      "Evaluate your trading decisions and understand how your strategy performs over time.",
  },
];

export default function Features() {
  const reduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="features"
      className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 lg:px-16 lg:py-32"
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Built for learning
        </p>

        <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
          Practice with purpose.
        </h2>

        <p className="mt-5 leading-7 text-slate-400">
          A focused environment to explore markets, develop a process,
          and learn from your decisions.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-14 grid gap-5 md:grid-cols-3"
      >
        {features.map((feature) => (
          <motion.article
            key={feature.number}
            variants={cardVariants}
            whileHover={
              reduceMotion
                ? undefined
                : {
                    y: -7,
                    transition: { duration: 0.25 },
                  }
            }
            className="group rounded-2xl border border-white/[0.08] bg-[#0c1321] p-7 transition-colors duration-300 hover:border-emerald-400/30 hover:bg-[#101a2b]"
          >
            <div className="flex items-center justify-between">
              <motion.span
                whileHover={
                  reduceMotion
                    ? undefined
                    : { scale: 1.08, rotate: 4 }
                }
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] text-2xl text-emerald-400"
              >
                {feature.icon}
              </motion.span>

              <span className="text-sm text-slate-600 transition-colors duration-300 group-hover:text-emerald-400">
                {feature.number}
              </span>
            </div>

            <h3 className="mt-7 text-xl font-semibold transition-colors duration-300 group-hover:text-emerald-300">
              {feature.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              {feature.description}
            </p>

            <div className="mt-6 h-px w-10 bg-emerald-400/40 transition-all duration-300 group-hover:w-20 group-hover:bg-emerald-400" />
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
