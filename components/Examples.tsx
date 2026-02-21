import React from "react";
import Link from "next/link";

const CASES = [
  {
    sector: "Marketing Intelligence",
    title: "A client’s 15 years of staff logs → 20× marketing boost",
    summary: "Converted historical staffing and event logs into structured growth intelligence: trend extraction, segment mapping, content triggers, and campaign direction tied to real demand data.",
    before: "Siloed historical logs",
    after: "20× marketing lift",
    tags: ["Data Intelligence", "Laravel 12", "Growth Automation", "SEO Systems"],
    accentColor: "brand",
  },
  {
    sector: "Performance Optimization",
    title: "WordPress blog migrated to custom platform",
    summary: "Switched from 9-second loading WordPress blog to custom platform with Livewire SPA, lazy loading, advanced caching, font swapping, and comprehensive SEO optimization.",
    before: "9s page load time",
    after: "0.8s average load time",
    tags: ["Livewire", "SPA", "SEO Optimization", "Performance"],
    accentColor: "success",
  },
  {
    sector: "Agent Automation",
    title: "Elite automation platform adaptable to any use case",
    summary: "Built a reusable multi-agent orchestration layer with shared context, queue controls, remediation guidance, and support payload exports so teams can ship automations safely at scale.",
    before: "One-off scripts and manual ops",
    after: "Composable automation workflows",
    tags: ["Agent Orchestration", "Automation", "ChromaDB", "Operational Reliability"],
    accentColor: "accent",
  },
  {
    sector: "Email Marketing",
    title: "Emails hitting spam? 98% inbox rate now",
    summary: "Complete email deliverability overhaul: DNS configuration, dedicated sending domains, warming schedule, unsubscribe compliance, dead email culling, engagement segmentation, IP reputation monitoring, and comprehensive deliverability reporting.",
    before: "60% delivery",
    after: "98% delivery",
    tags: ["SPF/DKIM", "Sendgrid", "Email Compliance", "List Hygiene"],
    accentColor: "highlight",
  },
];

export default function Examples() {
  return (
    <section id="examples" className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-highlight-50 py-24">
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-32 bg-gradient-to-b from-highlight-100/60 via-white/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-32 bg-gradient-to-t from-brand-900/15 via-brand-800/5 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(3,101,100,0.08),_transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute left-4 top-16 h-3 w-3 rounded-full bg-success-400/20 animate-ping" />
        <div className="pointer-events-none absolute right-8 top-24 h-1 w-12 rounded-full bg-brand-400/15 animate-pulse" style={{animationDelay: '0.5s'}} />
        <div className="pointer-events-none absolute left-1/3 bottom-16 h-4 w-4 rotate-45 bg-accent-400/25 animate-bounce" style={{animationDelay: '1.5s'}} />

        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-success-50 to-brand-50 px-4 py-2 text-sm font-medium text-success-700">
              <span className="h-2 w-2 rounded-full bg-success-500 animate-pulse"></span>
              Real results
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-zinc-900 to-brand-800 bg-clip-text text-transparent md:text-5xl">Proof it works in the real world</h2>
            <p className="mt-3 max-w-2xl text-lg text-zinc-600">
              Real before/after outcomes: legacy data converted into growth,
              automation platforms that adapt by use case, and modern stack
              upgrades that keep revenue systems current in 2026.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-600 shadow-sm transition hover:border-brand-300 hover:text-brand-700"
          >
            View in-depth demos
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {CASES.map((item) => (
            <article
              key={item.title}
              className={`group flex flex-col gap-5 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
                item.accentColor === 'brand'
                  ? 'before:bg-brand-500'
                  : item.accentColor === 'success'
                  ? 'before:bg-success-500'
                  : item.accentColor === 'accent'
                  ? 'before:bg-accent-500'
                  : item.accentColor === 'highlight'
                  ? 'before:bg-highlight-500'
                  : 'before:bg-zinc-500'
              } before:absolute before:left-0 before:top-0 before:h-full before:w-1`}
            >
              <div className={`flex items-center justify-between text-xs uppercase tracking-widest ${
                item.accentColor === 'brand'
                  ? 'text-brand-600'
                  : item.accentColor === 'success'
                  ? 'text-success-600'
                  : item.accentColor === 'accent'
                  ? 'text-accent-600'
                  : item.accentColor === 'highlight'
                  ? 'text-highlight-600'
                  : 'text-zinc-600'
              }`}>
                <span>{item.sector}</span>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  item.accentColor === 'brand'
                    ? 'bg-brand-500/10 text-brand-700'
                    : item.accentColor === 'success'
                    ? 'bg-success-500/10 text-success-700'
                    : item.accentColor === 'accent'
                    ? 'bg-accent-500/10 text-accent-700'
                    : item.accentColor === 'highlight'
                    ? 'bg-highlight-500/10 text-highlight-700'
                    : 'bg-zinc-500/10 text-zinc-700'
                }`}>
                  Case snapshot
                </span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-600">{item.summary}</p>
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-400">Before</p>
                  <p className="mt-1 font-semibold text-zinc-800">{item.before}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-success-600 font-semibold">After</p>
                  <p className="mt-1 font-bold text-success-700">{item.after}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.accentColor === 'brand'
                        ? 'bg-brand-500/10 text-brand-700'
                        : item.accentColor === 'success'
                        ? 'bg-success-500/10 text-success-700'
                        : item.accentColor === 'accent'
                        ? 'bg-accent-500/10 text-accent-700'
                        : item.accentColor === 'highlight'
                        ? 'bg-highlight-500/10 text-highlight-700'
                        : 'bg-zinc-500/10 text-zinc-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
