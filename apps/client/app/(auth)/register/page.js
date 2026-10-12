
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";
import api from "@/lib/api";

const marketData = [
  { symbol: "NIFTY 50", value: "24,968.40", change: "+1.24%" },
  { symbol: "S&P 500", value: "6,735.80", change: "+0.86%" },
  { symbol: "NASDAQ", value: "22,941.80", change: "+1.42%" },
];

function MarketChart() {
  const points = [
    135, 126, 131, 112, 119, 104, 111, 92, 101, 86, 94, 72, 80,
    62, 70, 52, 61, 40, 47, 30, 38, 21, 29, 13,
  ];

  const line = points
    .map((y, i) => `${(i / (points.length - 1)) * 600},${y}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 600 165"
      className="h-auto w-full"
      role="img"
      aria-label="Illustrative rising stock market chart"
    >
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity=".24" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[35, 75, 115, 155].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="600"
          y2={y}
          stroke="#334155"
          strokeDasharray="4 7"
        />
      ))}

      <polygon
        points={`0,165 ${line} 600,165`}
        fill="url(#chartFill)"
      />

      <polyline
        points={line}
        fill="none"
        stroke="#34d399"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="600" cy="13" r="5" fill="#34d399" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [captchaToken, setCaptchaToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!captchaToken) {
      setError("Please complete the security verification.");
      return;
    }

    setLoading(true);

    try {
      const email = form.email.trim().toLowerCase();

      await api.post("/api/auth/register", {
        email,
        password: form.password,
        captchaToken,
      });

      router.push(
        `/verify-email?email=${encodeURIComponent(email)}`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
      setCaptchaToken("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b14] text-white">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-500/[0.08] blur-[120px]" />

      <header className="relative z-10 flex h-20 items-center justify-between border-b border-white/[0.07] px-6 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-xl font-black text-slate-950">
            T
          </div>
          <span className="text-xl font-bold tracking-tight">
            TradeFlow
          </span>
        </Link>

        <p className="text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Sign in
          </Link>
        </p>
      </header>

      <section className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-[1440px] grid-cols-1 lg:grid-cols-2">
        {/* LEFT: Trading platform presentation */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
          <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-2 text-xs font-medium text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            YOUR MARKETS. YOUR STRATEGY.
          </div>

          <h1 className="max-w-xl text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl xl:text-6xl">
            Trade smarter.
            <br />
            <span className="text-emerald-400">
              Risk nothing.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-slate-400 sm:text-lg">
            Practice your trading strategies in a simulated market.
            Build confidence, analyze your performance, and learn
            without risking real money.
          </p>

          {/* Chart card */}
          <div className="mt-10 max-w-xl rounded-2xl border border-white/[0.09] bg-[#0c1321]/90 p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">
                  Market movement
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Learn the trends
                </h2>
              </div>

              <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                DEMO CHART
              </span>
            </div>

            <div className="mt-6">
              <MarketChart />
            </div>

            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Session start</span>
              <span>Illustrative data</span>
              <span>Session end</span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-5">
              {marketData.map((market) => (
                <div key={market.symbol} className="min-w-0">
                  <p className="truncate text-xs text-slate-400">
                    {market.symbol}
                  </p>
                  <p className="mt-2 truncate text-sm font-semibold sm:text-base">
                    {market.value}
                  </p>
                  <p className="mt-1 text-xs font-medium text-emerald-400">
                    {market.change}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] leading-4 text-slate-500">
              Illustrative interface values only, not live market data
              or investment advice.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Virtual trading
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Track your portfolio
            </span>
            <span className="flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Learn risk management
            </span>
          </div>
        </div>

        {/* RIGHT: Registration form */}
        <div className="flex items-center justify-center px-5 py-12 sm:px-12 lg:border-l lg:border-white/[0.07] lg:px-12 xl:px-20">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Get started for free
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Set up your account and start exploring the markets.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-200"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-700/80 bg-[#0b1120] px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-slate-700/80 bg-[#0b1120] px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-200"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-slate-700/80 bg-[#0b1120] px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                />
              </div>

              <div className="overflow-hidden rounded-lg">
                <Turnstile
                  siteKey={
                    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""
                  }
                  onSuccess={setCaptchaToken}
                  onExpire={() => setCaptchaToken("")}
                  onError={() => setCaptchaToken("")}
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating your account..." : "Create account"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>

              <p className="text-center text-xs leading-5 text-slate-500">
                By continuing, you agree to use TradeFlow as a paper
                trading simulator. No real trades are placed.
              </p>
            </form>

            <div className="mt-8 border-t border-white/[0.08] pt-6 text-center text-sm text-slate-400">
              Already registered?{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/[0.07] px-6 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} TradeFlow · Paper trading and market
        simulation
      </footer>
    </main>
  );
}
