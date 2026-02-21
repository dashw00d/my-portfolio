import React, { useMemo, useState, useEffect, useRef } from "react";
import { ServerCrash, MailX, UserX, EyeOff } from "lucide-react";
import TerminalBlock from "./TerminalBlock";

interface Problem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  fix: string;
  color: string; // e.g., "from-danger-500 to-danger-600"
  textColor: string; // e.g., "text-danger-900"
  iconBg: string; // e.g., "bg-danger-100"
}

interface ProofPoint {
  value: string;
  label: string;
  color: "brand" | "success" | "accent"; // For data-driven colors
}

const colorClasses: Record<ProofPoint["color"], string> = {
  brand: "text-brand-700",
  success: "text-success-700",
  accent: "text-accent-700",
};

const problems: Problem[] = [
  {
    icon: ServerCrash,
    title: "Site crashes when you need it most",
    description: "Peak hours, big campaigns, Black Friday—your server gives up. Every minute down = money out the door.",
    fix: "I stabilise hosting, set up autoscaling, and monitor so you're ready for traffic spikes.",
    color: "from-danger-500 to-danger-600",
    textColor: "text-danger-900",
    iconBg: "bg-danger-100",
  },
  {
    icon: MailX,
    title: "Your emails never reach customers",
    description: "Confirmations, receipts, updates—all in spam. Customers think you're ignoring them. Trust evaporates.",
    fix: "Run a deliverability audit, repair DNS, and build a warm-up plan so inbox placement sticks.",
    color: "from-warning-500 to-warning-600",
    textColor: "text-warning-900",
    iconBg: "bg-warning-100",
  },
  {
    icon: UserX,
    title: "Leads fill out forms... then nothing",
    description: "No tracking, no follow-up, no pipeline. You're paying for traffic that disappears into a black hole.",
    fix: "Integrate CRM + analytics, wire alerts, and build automations so every lead is captured.",
    color: "from-accent-500 to-accent-600",
    textColor: "text-accent-900",
    iconBg: "bg-accent-100",
  },
  {
    icon: EyeOff,
    title: "Invisible on Google",
    description: "Competitors show up first. You're on page 3. Customers searching for exactly what you offer can't find you.",
    fix: "Repair technical SEO, structure content, and build authority so you show up where buyers look.",
    color: "from-highlight-500 to-highlight-600",
    textColor: "text-highlight-900",
    iconBg: "bg-highlight-100",
  },
];

const proofPoints: ProofPoint[] = [
  { value: "28%", label: "avg conversion lift after fixes", color: "brand" },
  { value: "< 30 days", label: "to resolve priority issues", color: "success" },
  { value: "12+", label: "industries supported to date", color: "accent" },
];

function Problems() {
  const terminalLines = useMemo(
    () => [
      "Checking your site...",
      "> Slow load times killing conversions?",
      "> Emails disappearing into spam?",
      "> Leads slipping through cracks?",
      "> Google ranking nowhere to be found?",
      "I can fix that.",
    ],
    []
  );

// Using your custom Paw_Print.svg
function createPawSVG(size: number, color: string) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 595.276 841.89"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-sm"
    >
      <g transform="translate(269.81467,-650.62904)">
        {/* Main paw pad */}
        <path
          d="m -126.267,1038.85 c 22.737,50.44 15.792,102.75 -15.51,116.87 -31.303,14.12 -75.11,-15.31 -97.845,-65.74 -22.737,-50.43 -15.793,-102.745 15.51,-116.863 31.303,-14.114 75.108,15.317 97.845,65.733 z"
          fill={color}
          stroke="none"
        />
        {/* Right paw section */}
        <path
          d="m 183.155,1038.85 c -22.738,50.44 -15.793,102.75 15.512,116.87 31.303,14.12 75.106,-15.31 97.846,-65.74 22.734,-50.43 15.789,-102.745 -15.513,-116.863 -31.301,-14.114 -75.108,15.317 -97.845,65.733 z"
          fill={color}
          stroke="none"
        />
        {/* Top left toe */}
        <path
          d="m 6.7856,937.757 c 11.6548,54.069 -6.1108,103.763 -39.6787,111.003 -33.5654,7.23 -70.2249,-30.74 -81.8779,-84.804 -11.653,-54.068 6.112,-103.764 39.6792,-110.997 33.5669,-7.236 70.2246,30.729 81.8774,84.798 z"
          fill={color}
          stroke="none"
        />
        {/* Top right toe */}
        <path
          d="m 49.2676,937.803 c -11.6446,54.068 6.1084,103.767 39.6738,110.997 33.5676,7.24 70.2256,-30.73 81.8776,-84.797 11.654,-54.069 -6.109,-103.765 -39.678,-110.998 -33.5678,-7.234 -70.225,30.729 -81.8734,84.798 z"
          fill={color}
          stroke="none"
        />
        {/* Center palm */}
        <path
          d="m -35.2275,1118.5 c -8.1924,14.15 -46.1563,60.99 -72.4145,76.97 -26.256,15.98 -58.792,39.38 -53.332,93.11 5.457,53.74 60.575,76.74 96.8597,74.7 36.2867,-2.03 104.6993,-8.71 153.543,-1.94 48.8413,6.77 110.4863,1.64 124.9223,-49.81 14.436,-51.45 -17.85,-84.23 -43.044,-102.83 -25.193,-18.59 -67.265,-74.2 -80.2269,-99.73 -12.96,-25.52 -78.9268,-72.26 -126.3076,9.53 z"
          fill={color}
          stroke="none"
        />
      </g>
    </svg>
  );
}

function PawTrail() {
  const [paws, setPaws] = useState<Array<{ id: number; x: number; y: number; size: number; color: string }>>([]);
  const [sectionBounds, setSectionBounds] = useState({ width: 800, height: 600 });
  const pawIdRef = useRef(0);

  // Get section bounds
  useEffect(() => {
    const updateBounds = () => {
      const problemsSection = document.getElementById('problems');
      if (problemsSection) {
        const bounds = problemsSection.getBoundingClientRect();
        setSectionBounds({ width: bounds.width, height: bounds.height });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Create paws when bounds are available
  useEffect(() => {
    if (sectionBounds.width <= 800) {
      return;
    }

    setPaws([]);

    const activeTimeouts = new Set<number>();
    const schedule = (callback: () => void, delay: number) => {
      const timeoutId = window.setTimeout(() => {
        activeTimeouts.delete(timeoutId);
        callback();
      }, delay);
      activeTimeouts.add(timeoutId);
    };

    const createPaw = () => {
      const id = ++pawIdRef.current;
      const x = Math.random() * Math.max(0, sectionBounds.width - 100);
      const y = Math.random() * Math.max(0, sectionBounds.height - 100);
      const size = 24 + Math.random() * 28;
      const hue = 205 + Math.random() * 40; // Tighter blue/teal band
      const opacity = 0.1 + Math.random() * 0.12;
      const color = `hsla(${hue}, 60%, 88%, ${opacity})`;

      const newPaw = { id, x, y, size, color };
      setPaws(prev => [...prev, newPaw]);

      schedule(() => {
        setPaws(prev => prev.filter(paw => paw.id !== id));
      }, 4000);
    };

    for (let i = 0; i < 5; i += 1) {
      schedule(createPaw, i * 150);
    }

    const startPawTrail = () => {
      createPaw();
      const nextInterval = 900 + Math.random() * 700;
      schedule(startPawTrail, nextInterval);
    };

    schedule(startPawTrail, 1200);

    return () => {
      activeTimeouts.forEach(timeoutId => window.clearTimeout(timeoutId));
      activeTimeouts.clear();
    };
  }, [sectionBounds]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      {paws.map(paw => (
        <div
          key={paw.id}
          className="absolute animate-fade-in"
          style={{
            left: paw.x,
            top: paw.y,
            transform: "translate(-50%, -50%)"
          }}
        >
          {createPawSVG(paw.size, paw.color)}
        </div>
      ))}
    </div>
  );
}

function TerminalAudit() {
  return (
    <div className="relative mt-20 sm:mt-16">
      <div className="pointer-events-none absolute left-1/2 -top-[32px] flex w-32 -translate-x-1/2 drop-shadow-2xl sm:w-40">
        <img
          src="/images/doggo.png"
          alt="Friendly dog peeking over the diagnostics terminal"
          width={128}
          height={104}
          className="select-none"
        />
      </div>
      <div
        className="rounded-3xl border border-zinc-200 bg-white/80 p-1 shadow-sm"
        role="complementary"
        aria-label="Common red flags terminal audit"
      >
        <div className="rounded-[1.45rem] border border-brand-100/80 bg-gradient-to-br from-brand-50/70 via-white to-brand-100/60 p-6 pt-10 sm:pt-12">
          <TerminalBlock title="common red flags" lines={terminalLines} />
        </div>
      </div>
    </div>
  );
}

function CtaCard() {
  return (
    <div
      className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-success-50/30 p-6 text-left shadow-sm"
      role="complementary"
      aria-label="Site audit call-to-action"
    >
      <p className="text-xl font-semibold text-zinc-900">Score a no-fluff site audit</p>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">
        I&apos;ll review performance, deliverability, and lead flows, then we walk the findings together on a 20-minute video call.
      </p>
      <a
        href="#contact-form"
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-brand-500/30 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 hover:shadow-lg hover:shadow-brand-500/40"
      >
        Hold my spot
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </a>
    </div>
  );
}

function ProofPointCard({ point }: { point: ProofPoint }) {
  return (
    <article
      className="group rounded-2xl border border-zinc-100 bg-zinc-50 p-4 text-left shadow-sm transition-all hover:scale-[1.02] focus-within:ring-2 focus-within:ring-brand-500"
      tabIndex={0}
      aria-label={`${point.value} for ${point.label}`}
    >
      <p className={`text-xl font-bold whitespace-nowrap ${point.color ? colorClasses[point.color] : "text-brand-700"}`}>
        {point.value}
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 leading-tight">
        {point.label}
      </p>
    </article>
  );
}

function ProofPoints() {
  if (!proofPoints.length) {
    return null; // Or a fallback
  }

  return (
    <section
      className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
      aria-labelledby="proof-title"
    >
      <header className="flex items-center justify-between">
        <h3 id="proof-title" className="text-xs font-semibold uppercase tracking-wide text-brand-500">
          What owners care about
        </h3>
        <span className="text-xs font-medium text-zinc-400">Benchmarks at a glance</span>
      </header>
      <div className="mt-4 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-3">
        {proofPoints.map((point) => (
          <ProofPointCard key={point.label} point={point} />
        ))}
      </div>
    </section>
  );
}

function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <article
      className={`group grid gap-3 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[auto,1fr] relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:${problem.color} before:opacity-60 focus-within:ring-2 focus-within:ring-current/20`}
      tabIndex={0}
      role="article"
      aria-labelledby={`problem-title-${problem.title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div
        className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${problem.iconBg}`}
        aria-hidden="true"
      >
        <problem.icon className={`h-6 w-6 ${problem.textColor}`} />
      </div>
      <div>
        <h3
          id={`problem-title-${problem.title.toLowerCase().replace(/\s+/g, '-')}`}
          className={`text-lg font-semibold ${problem.textColor}`}
        >
          {problem.title}
        </h3>
        <p className="mt-2 text-sm text-zinc-600">{problem.description}</p>
        <div
          className="mt-4 rounded-2xl border border-brand-100/70 bg-gradient-to-br from-brand-50/60 to-success-50/30 p-4 text-sm font-medium text-brand-900 shadow-inner"
          role="complementary"
          aria-label="The fix for this problem"
        >
          <span className="uppercase tracking-widest text-xs font-semibold text-success-600">
            The fix
          </span>
          <p className="mt-2 leading-relaxed">{problem.fix}</p>
        </div>
      </div>
    </article>
  );
}

  return (
    <>
      <PawTrail />
      <section
        id="problems"
        className="relative bg-gradient-to-b from-brand-50 via-white to-highlight-50/70 py-24 -mt-1"
        aria-labelledby="problems-hero"
      >
        {/* Decorative gradients and patterns */}
        <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-32 bg-gradient-to-t from-brand-900/20 via-brand-900/5 to-transparent" />
        <div className="pointer-events-none absolute inset-0 paw-trail-layer paw-trail-layer--reverse opacity-15" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(3,101,100,0.1),_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 id="problems-hero" className="mx-auto mb-4 max-w-3xl text-4xl font-bold text-zinc-900 lg:text-5xl">
            Spot the leak → deploy the fix
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-600">
            These are the headaches owners describe on our first call. I pair diagnostics with a playbook that&apos;s proven to stop the bleeding fast.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start" role="complementary">
            <TerminalAudit />
            <CtaCard />
            <ProofPoints />
          </aside>

          <div className="grid gap-6" role="main">
            {problems.map((problem, index) => (
              <ProblemCard key={index} problem={problem} />
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default Problems;
