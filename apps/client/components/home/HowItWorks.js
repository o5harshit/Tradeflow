import Reveal from "./Reveal";

const steps = [
  {
    number: "01",
    title: "Create your account",
    description: "Register securely and verify your email.",
  },
  {
    number: "02",
    title: "Explore the markets",
    description: "Discover assets and prepare your watchlist.",
  },
  {
    number: "03",
    title: "Start paper trading",
    description: "Practice with virtual funds and review your results.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-white/[0.07] bg-[#0a101c]"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-10 lg:px-16 lg:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
          Simple by design
        </p>

        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
          From your first login to your first practice trade.
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.14}>
              <article className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors duration-300 hover:border-emerald-400/30">
                <p className="font-mono text-sm text-emerald-400">
                  STEP {step.number}
                </p>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
