import React from "react";
import Link from "@/components/Link";
import { ArrowRight, Mail, ShieldCheck, Rocket, LineChart } from "lucide-react";
import CustomBuildCta from "./CustomBuildCta";

const QUARTER_BOOKING_COPY: Record<number, string> = {
  1: "Booking web & app projects for Q1",
  2: "Booking web & app projects for Q2",
  3: "Booking web & app projects for Q3",
  4: "Booking web & app projects for Q4",
};

const getQuarterFromDate = (date: Date) => Math.floor(date.getMonth() / 3) + 1;

const getQuarterBookingCopy = (date: Date) => {
  const quarter = getQuarterFromDate(date);
  return QUARTER_BOOKING_COPY[quarter] ?? "Booking web & app projects";
};

const useQuarterBookingCopy = () => {
  const [copy, setCopy] = React.useState(() => getQuarterBookingCopy(new Date()));

  React.useEffect(() => {
    setCopy(getQuarterBookingCopy(new Date()));
  }, []);

  return copy;
};

const PROOF_POINTS = [
  {
    icon: ShieldCheck,
    label: "Results from real projects",
    value: "20× campaign lift",
    description:
      "Turned a client’s 15 years of staffing records into more effective marketing.",
    accent: "text-brand-600",
    bar: "before:bg-brand-500",
  },
  {
    icon: Rocket,
    label: "Practical automation",
    value: "Less manual work",
    description:
      "Connect your tools, follow up with leads, and cut down on repetitive admin.",
    accent: "text-success-600",
    bar: "before:bg-success-500",
  },
  {
    icon: LineChart,
    label: "Tools I build with",
    value: "Laravel 13 · Astro · React",
    description:
      "PHP, TypeScript, and the right integrations for your website or custom app.",
    accent: "text-accent-600",
    bar: "before:bg-accent-500",
  },
];

export default function Hero() {
  const quarterBookingCopy = useQuarterBookingCopy();

  return (
    <section id="home" className="relative overflow-hidden px-6 pb-24 pt-32 md:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="paw-trail-layer" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_-10%,rgba(205,231,228,0.6),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_40%_at_95%_30%,rgba(235,218,192,0.5),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white/70 to-brand-50/70" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="max-w-2xl">
            <div className="section-eyebrow mb-8 text-[11px] tracking-[0.15em] sm:text-xs sm:tracking-[0.2em]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success-500" />
              <span suppressHydrationWarning>{quarterBookingCopy}</span>
            </div>

            <h1 className="mb-6 bg-gradient-to-r from-zinc-900 via-brand-900 to-accent-900 bg-clip-text text-5xl font-black leading-[1.03] tracking-tight text-transparent sm:text-6xl md:text-7xl">
              Websites and tools that work for your business
            </h1>

            <p className="mb-9 max-w-xl text-lg leading-relaxed text-zinc-600 md:text-xl">
              I help small businesses fix slow websites, connect their tools,
              and build custom apps that save time. Whether you need a better
              website or less manual admin, you work directly with me.
            </p>

            <div className="mb-10 flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 shadow-soft ring-1 ring-inset ring-white/50">
                  <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-brand-500/70">
                    RY
                  </div>
                  <img
                    src="/images/ryan_stefan.png"
                    alt="Ryan Stefan"
                    className="relative h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-success-500" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900">Ryan Stefan</div>
                <div className="mt-0.5 text-sm text-zinc-500">
                  Web developer & automation specialist
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="#contact-form" className="btn-primary group">
                Tell me what you need
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
              <a
                href="mailto:ryan@dashwood.net"
                className="btn-secondary hover:border-brand-300 hover:text-brand-600"
              >
                <Mail className="h-4 w-4" />
                Email Ryan directly
              </a>
            </div>
          </div>

          <div className="pt-6 lg:pl-4 lg:pt-0">
            <div className="relative">
              <CustomBuildCta
                className="w-full max-w-xl"
                eyebrow="Launching a new product?"
                headline="Let’s plan your custom app"
                subcopy="Map out your app, integrations, and launch plan before writing a line of code."
                decoration={
                  <img
                    src="/images/catto.png"
                    alt=""
                    aria-hidden="true"
                    width={1774}
                    height={887}
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 block h-auto w-36 -translate-x-1/2 translate-y-[22%] select-none sm:w-40 lg:w-44 xl:w-48"
                  />
                }
              />
            </div>
            <Link
              href="/projects"
              className="mb-10 mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:gap-2 hover:text-brand-400"
            >
              View examples
              <span aria-hidden>→</span>
            </Link>

            <div className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-accent-900 to-brand-800 p-8 text-white shadow-soft-lg ring-1 ring-inset ring-white/10 lg:block">
              <div className="pointer-events-none absolute -inset-24 bg-[radial-gradient(circle_at_top,_rgba(232,221,203,0.18),_transparent_70%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-highlight-300/60 to-transparent" />
              <div className="relative space-y-8">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-highlight-200/80">
                      A practical starting point
                    </p>
                    <h3 className="mt-2 text-3xl font-semibold text-white">
                      Start with a clear plan
                    </h3>
                  </div>
                  <div className="max-w-[13rem] space-y-1 text-right text-xs text-highlight-200/70">
                    <p className="font-semibold uppercase tracking-[0.35em] text-highlight-200/90">
                      Includes
                    </p>
                    <p className="text-highlight-100/80">
                      A conversation, clear priorities, and a plan that fits your budget.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 text-sm">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-brand-500/30">
                      <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Websites that pull their weight</p>
                      <p className="text-highlight-100/80">
                        Fast pages, clear information, and an easier path for customers to get in touch.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-success-500/30">
                      <Rocket className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Less copying, chasing, and retyping</p>
                      <p className="text-highlight-100/80">
                        Connect forms, email, and customer records. Use AI for tasks like sorting enquiries or drafting replies.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-4 py-3">
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-accent-500/30">
                      <LineChart className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Custom tools for the way you work</p>
                      <p className="text-highlight-100/80">
                        Booking systems, customer portals, and internal apps built around your business.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-white/15 bg-white/[0.07] px-5 py-4 text-sm">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-highlight-200/80">
                    <span>Client note</span>
                    <span className="h-px flex-1 bg-white/20" />
                    <span>Emergency rescue</span>
                  </div>
                  <p className="leading-relaxed text-highlight-50/90">
                    &ldquo;When our hosting company dropped support for our platform, Ryan came in and moved everything to a custom server overnight, saving us from a nightmare!&rdquo;
                  </p>
                  <p className="text-highlight-200/70">— CEO, Staffing Agency</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid divide-y divide-zinc-200/80 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/80 shadow-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {PROOF_POINTS.map((point) => (
            <div
              key={point.label}
              className={`relative p-6 transition-colors hover:bg-white ${point.bar} before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:content-[''] sm:before:hidden`}
            >
              <div className={`mb-3 flex items-center gap-2 text-sm font-semibold ${point.accent}`}>
                <point.icon className="h-4 w-4" />
                {point.label}
              </div>
              <p className="text-xl font-bold text-zinc-900">{point.value}</p>
              <p className="mt-1 text-sm text-zinc-500">{point.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10">
        <svg
          className="h-[120px] w-full text-brand-50"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M0,60L80,65C160,70,320,80,480,75C640,70,800,50,960,45C1120,40,1280,50,1360,55L1440,60L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}
