import React from "react";
import {
  PhoneCall,
  ClipboardCheck,
  Wrench,
  Sparkles,
  Clock,
  Target,
  Code2,
} from "lucide-react";

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
    copy: "If a fix won't grow or protect revenue, I'll point you to a better investment.",
  },
  {
    icon: Code2,
    title: "Hands on keys",
    copy: "No hand-offs. I write the code, configure tooling, and own the rollout.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="relative overflow-hidden bg-gradient-to-br from-zinc-50 via-brand-50/40 to-accent-50/30 py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 -top-24 h-32 bg-gradient-to-b from-zinc-900/20 via-brand-900/10 to-transparent" />
        <div className="absolute inset-x-0 -bottom-24 h-32 bg-gradient-to-t from-highlight-200/30 via-highlight-100/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_12%_10%,rgba(67,171,167,0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_88%_60%,rgba(65,112,148,0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(35%_35%_at_50%_100%,rgba(222,196,159,0.22),transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="section-eyebrow mb-4">
            <span className="h-2 w-2 rounded-full bg-success-500" />
            Proven process
          </div>
          <h2 className="gradient-heading text-4xl font-bold md:text-5xl">
            How we&apos;d work together
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-zinc-600">
            Clear plan, fast execution, and measurable outcomes. No retainers unless you ask for one.
          </p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="relative">
            <div className="space-y-6">
              <div
                className="pointer-events-none absolute bottom-10 left-7 top-10 w-px bg-gradient-to-b from-brand-300 via-accent-300 to-transparent"
                aria-hidden="true"
              />
              {STEPS.map((step, idx) => (
                <article key={step.title} className="group relative flex gap-6">
                  <div className="relative z-10 flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-600 text-white shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:scale-105">
                    <step.icon className="h-6 w-6" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-zinc-900 text-[11px] font-bold text-white">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="surface flex-1 p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-soft-lg">
                    <h3 className="text-xl font-bold text-zinc-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                      {step.description}
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-success-500/10 px-3.5 py-1.5 text-xs font-semibold text-success-700 ring-1 ring-inset ring-success-500/20">
                      <Sparkles className="h-3.5 w-3.5" />
                      {step.outcome}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-3xl border border-brand-200/70 bg-gradient-to-br from-brand-50 via-accent-50/50 to-brand-50/80 shadow-soft">
              <div className="flex flex-col gap-5 p-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
                    Pilot project cadence
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">
                    Most first engagements wrap in 2–4 weeks on a fixed fee.
                  </p>
                </div>
                <a href="#contact-form" className="btn-primary shrink-0">
                  Hold a discovery call
                </a>
              </div>
            </div>
          </div>

          <div className="lg:relative">
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="surface p-8">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand-600">
                  What never changes
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  Every engagement keeps communication tight and decisions simple.
                </p>
              </div>
              <div className="grid gap-4">
                {PRINCIPLES.map((item) => (
                  <div
                    key={item.title}
                    className="surface group flex items-start gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
                  >
                    <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/12 to-accent-500/12 text-brand-600 transition-colors duration-300 group-hover:from-brand-500/20 group-hover:to-accent-500/20">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-zinc-900">{item.title}</h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                        {item.copy}
                      </p>
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
