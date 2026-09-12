import React from "react";
import { ArrowRight, Check, Clock, Code2, Target } from "lucide-react";

const STEPS = [
  {
    title: "Understand the problem",
    description:
      "We start with a 30-minute call. You show me what’s happening, and I dig into the data to find what’s getting in the way.",
    outcome: "Recorded call + next steps within 24 hours",
  },
  {
    title: "Agree on the plan",
    description:
      "You get a clear scope, cost, timeline, and expected impact. We agree on what’s worth doing before the work begins.",
    outcome: "Scope + ROI summary within 48 hours",
  },
  {
    title: "Build, test, hand over",
    description:
      "I implement the plan, test the changes, and walk you through the results. Then we decide what’s next, together.",
    outcome: "Weekly progress Loom + final playbook",
  },
];

const PRINCIPLES = [
  {
    icon: Clock,
    title: "You won’t be chasing updates",
    copy: "Slack and email replies within one business day. Emergencies get priority.",
  },
  {
    icon: Target,
    title: "The work has to be worth it",
    copy: "If a fix won’t grow or protect revenue, I’ll point you to a better investment.",
  },
  {
    icon: Code2,
    title: "You work directly with me",
    copy: "I write the code, configure the tools, and take responsibility for the rollout.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="border-b border-highlight-200/60 bg-highlight-50/50 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end lg:gap-16">
          <div>
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
              <span aria-hidden="true" className="h-px w-8 bg-brand-500" />
              The process
            </p>
            <h2 id="process-heading" className="mt-6 max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-brand-950 sm:text-5xl">
              How we’d work together
            </h2>
          </div>
          <p className="max-w-lg text-lg leading-relaxed text-zinc-600">
            A clear scope, regular updates, and results you can see.
            No retainer unless you want one.
          </p>
        </div>

        <ol className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-8 lg:gap-12">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex min-w-0 flex-col border-t border-brand-200/80 pt-6">
              <span aria-hidden="true" className="text-4xl font-light tabular-nums tracking-tight text-brand-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-xl font-bold text-brand-950">{step.title}</h3>
              <p className="mt-3 flex-1 text-base leading-relaxed text-zinc-600">
                {step.description}
              </p>
              <p className="mt-6 flex items-start gap-2 text-sm font-semibold leading-relaxed text-brand-700">
                <Check className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                {step.outcome}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-12 rounded-2xl border border-brand-100 bg-brand-50/70 p-6 sm:p-8 lg:mt-14">
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">Start with a focused project</p>
              <p className="mt-2 text-lg font-semibold text-brand-950">
                Most first engagements wrap in 2–4 weeks, for a fixed fee.
              </p>
            </div>
            <a
              href="#contact-form"
              className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-3 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 sm:w-auto"
            >
              Let’s talk about your project
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-3 md:gap-8 lg:gap-12">
          {PRINCIPLES.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <item.icon className="mt-1 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-bold text-brand-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
