"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const markets = {
  NIFTY: {
    label: "NIFTY 50",
    price: 24968.4,
    change: 1.24,
    points: [70, 62, 68, 48, 56, 41, 48, 32, 39, 22, 30, 12],
  },
  SP500: {
    label: "S&P 500",
    price: 6735.8,
    change: 0.86,
    points: [65, 70, 52, 58, 43, 49, 32, 40, 27, 31, 18, 12],
  },
  NASDAQ: {
    label: "NASDAQ",
    price: 22941.8,
    change: 1.42,
    points: [78, 67, 72, 51, 59, 38, 47, 28, 36, 18, 25, 10],
  },
};

function Chart({ points, market }) {
  const reduceMotion = useReducedMotion();

  const coordinates = points
    .map(
      (point, index) =>
        `${index * (600 / (points.length - 1))},${point * 1.5}`
    )
    .join(" ");

  return (
    <svg
      viewBox="0 0 600 165"
      className="w-full overflow-visible"
      role="img"
      aria-label={`${market} illustrative price chart`}
    >
      <defs>
        <linearGradient
          id="marketGradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#34d399" stopOpacity=".24" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[30, 65, 100, 135, 165].map((y) => (
        <line
          key={y}
          x1="0"
          x2="600"
          y1={y}
          y2={y}
          stroke="#334155"
          strokeDasharray="4 7"
        />
      ))}

      <polygon
        points={`0,165 ${coordinates} 600,165`}
        fill="url(#marketGradient)"
      />

      <motion.polyline
        points={coordinates}
        fill="none"
        stroke="#34d399"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: reduceMotion ? 0 : 1.4,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
}

export default function MarketPreview() {
  const [selected, setSelected] = useState("NIFTY");
  const [tick, setTick] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((value) => value + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const market = markets[selected];

  // Small visual-only movement; this is not live market data.
  const displayedPrice = market.price + Math.sin(tick * 0.8) * 2.5;

  const formatPrice = (value) =>
    value.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-5 rounded-[32px] bg-emerald-400/[0.06] blur-3xl" />

      <div className="relative rounded-2xl border border-white/[0.09] bg-[#0c1321] p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-slate-400">Market simulator</p>
            <h2 className="mt-2 text-2xl font-semibold">
              {market.label}
            </h2>
          </div>

          <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            DEMO DATA
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {Object.entries(markets).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              aria-pressed={selected === key}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                selected === key
                  ? "bg-emerald-400 text-slate-950"
                  : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-7">
          <p className="text-xs text-slate-400">
            Illustrative index value
          </p>

          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={selected}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reduceMotion ? undefined : { opacity: 0, y: -8 }
                }
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {formatPrice(displayedPrice)}
              </motion.span>
            </AnimatePresence>

            <span className="text-sm font-medium text-emerald-400">
              +{market.change.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="mt-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.25 }}
            >
              <Chart points={market.points} market={market.label} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>Session start</span>
          <span>Illustrative trend</span>
          <span>Session end</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-5">
          <div className="rounded-xl bg-white/[0.025] p-4">
            <p className="text-xs text-slate-400">Trading balance</p>
            <p className="mt-2 text-xl font-semibold">₹10,00,000</p>
            <p className="mt-1 text-xs text-slate-500">
              Example virtual funds
            </p>
          </div>

          <div className="rounded-xl bg-white/[0.025] p-4">
            <p className="text-xs text-slate-400">Trading mode</p>
            <p className="mt-2 text-xl font-semibold text-emerald-400">
              Paper
            </p>
            <p className="mt-1 text-xs text-slate-500">
              No real orders
            </p>
          </div>
        </div>

        <p className="mt-4 text-[10px] leading-4 text-slate-500">
          Demonstration values only. Prices and balance are not live
          data or a real user account.
        </p>
      </div>
    </div>
  );
}
