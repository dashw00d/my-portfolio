import React from "react";
import { PhoneCall, ClipboardCheck, Wrench, Sparkles, Clock, Target, Code2 } from "lucide-react";

const STEPS = [
  {
    title: "Map the pain",
    description:
      "We hop on a 30-minute call. You walk me through the symptoms, I dig into the data and surface the hidden blockers.",
    icon: PhoneCall,
    outcome: "Recorded call + next steps inside 24 hours",
  },
  {
    title: "Ship the action plan",
    description:
      "You get a plain-English plan covering fixes, cost, timeline, and impact. Shareable with partners or your internal team.",
    icon: ClipboardCheck,
    outcome: "Scope + ROI summary inside 48 hours",
  },
  {
    title: "Execute + debrief",
    description:
      "I implement, test, and report back with before/after numbers. Then you decide if we continue or wrap.",
    icon: Wrench,
    outcome: "Weekly progress Loom + final playbook",
  },
];

const PRINCIPLES = [
  {
    icon: Clock,
    title: "Fast response",
    copy: "Slack & email replies within one business day, emergencies faster.",
  },
  {
    icon: Target,
    title: "ROI first",
    copy: "If a fix won&apos;t grow or protect revenue, I&apos;ll point you to a better investment.",
  },
  {
    icon: Code2,
    title: "Hands on keys",
    copy: "No hand-offs. I write the code, configure tooling, and own the rollout.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-brand-50/40 to-accent-50/30 py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-24 h-32 bg-gradient-to-b from-zinc-900/30 via-brand-900/10 to-transparent" />
        <div className="absolute inset-x-0 -bottom-24 h-32 bg-gradient-to-t from-highlight-200/30 via-highlight-100/10 to-transparent" />
        <div className="absolute left-[10%] top-8 h-64 w-64 rounded-full bg-brand-400/25 blur-3xl" />
        <div className="absolute right-[5%] top-1/2 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="absolute left-1/2 bottom-12 h-56 w-56 rounded-full bg-highlight-300/18 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(205,179,128,0.18),_transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute left-8 top-20 h-2 w-2 rounded-full bg-brand-400/30 animate-ping" />
        <div className="pointer-events-none absolute right-12 top-32 h-1 w-8 rounded-full bg-accent-400/20 animate-pulse" style={{animationDelay: '1s'}} />
        <div className="pointer-events-none absolute left-1/4 bottom-20 h-3 w-3 rotate-45 bg-highlight-400/25 animate-bounce" style={{animationDelay: '2s'}} />

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-50 to-accent-50 px-4 py-2 text-sm font-medium text-brand-700">
            <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></span>
            Proven process
          </div>
          <h2 className="bg-gradient-to-r from-slate-900 via-brand-900 to-accent-900 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            How we&apos;d work together
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Clear plan, fast execution, and measurable outcomes. No retainers unless you ask for one.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            {STEPS.map((step, idx) => (
              <article
                key={step.title}
                className="group rounded-3xl border border-slate-200/60 bg-white/90 p-8 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-200/50"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-brand-500/40">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500/20 to-accent-500/20 text-sm font-bold text-brand-600">
                        {idx + 1}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600">{step.description}</p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-success-500/15 to-success-600/15 px-4 py-1.5 text-xs font-semibold text-success-700 shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      {step.outcome}
                    </div>
                  </div>
                </div>
              </article>
            ))}
            <div className="rounded-3xl border border-brand-200/80 bg-gradient-to-br from-brand-50 via-accent-50/50 to-brand-50/80 p-8 shadow-lg shadow-brand-200/50 backdrop-blur-sm">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">Pilot project cadence</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Most first engagements wrap in 2–4 weeks on a fixed fee.</p>
                </div>
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/50"
                >
                  Hold a discovery call
                </a>
              </div>
            </div>
          </div>

          <div className="lg:relative">
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-slate-200/60 bg-white/90 p-8 shadow-lg shadow-slate-200/50 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">What never changes</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Every engagement keeps communication tight and decisions simple.
                </p>
              </div>
              <div className="grid gap-4">
                {PRINCIPLES.map((item) => (
                  <div
                    key={item.title}
                    className="group flex items-start gap-4 rounded-3xl border border-slate-200/60 bg-white/90 p-7 shadow-md shadow-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-200/40"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 text-brand-600 transition-all duration-300 group-hover:scale-110 group-hover:from-brand-500/20 group-hover:to-accent-500/20">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
